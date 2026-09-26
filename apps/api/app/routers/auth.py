from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache import CacheBackend
from app.config import settings
from app.database import get_db
from app.deps import get_current_learner, get_redis
from app.models.auth_challenge import (
    AuthChallenge,
    challenge_expiry,
    hash_challenge_token,
    issue_challenge_token,
)
from app.models.learner import Learner
from app.models.submission import LessonCompletion
from app.schemas import CamelModel
from app.security import attach_session_cookie, clear_session_cookie, staff_key_matches
from app.services.auth import create_access_token, decode_access_token, hash_password, verify_password
from app.services.rate_limit import clear_auth_failures, enforce_auth_rate_limit, record_auth_failure

router = APIRouter()
_bearer = HTTPBearer(auto_error=False)


class RegisterRequest(CamelModel):
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(min_length=8, max_length=128)
    display_name: str = Field(min_length=1, max_length=100)
    preferred_language: str = Field(default="en", pattern="^(en|sw)$")
    completed_lesson_ids: list[str] = Field(default_factory=list)


class LoginRequest(CamelModel):
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str


class GuestRequest(CamelModel):
    display_name: str = Field(min_length=1, max_length=100)
    preferred_language: str = Field(default="en", pattern="^(en|sw)$")


class LearnerPublic(CamelModel):
    id: str
    email: str | None
    display_name: str
    preferred_language: str
    total_xp: int
    level: int
    is_guest: bool
    email_verified: bool = False


class TokenResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"
    learner: LearnerPublic


class OfficeUnlockRequest(CamelModel):
    passphrase: str = Field(min_length=10, max_length=200)
    email: str = Field(min_length=3, max_length=320)


class OfficeUnlockResponse(CamelModel):
    ok: bool = True


class PasswordResetRequest(CamelModel):
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class PasswordResetConfirm(CamelModel):
    token: str = Field(min_length=20, max_length=200)
    password: str = Field(min_length=8, max_length=128)


class VerifyEmailRequest(CamelModel):
    token: str = Field(min_length=20, max_length=200)


class ChallengeIssued(CamelModel):
    ok: bool = True
    # Returned only outside production so local/dev can verify without SMTP.
    debug_token: str | None = None


def _public(learner: Learner) -> LearnerPublic:
    return LearnerPublic(
        id=learner.id,
        email=learner.email,
        display_name=learner.display_name,
        preferred_language=learner.preferred_language,
        total_xp=learner.total_xp,
        level=learner.level,
        is_guest=learner.is_guest,
        email_verified=bool(getattr(learner, "email_verified", False)),
    )


def _issued_token(learner_id: str) -> str:
    return create_access_token(learner_id)


def _token_body(learner: Learner, token: str, response: Response) -> TokenResponse:
    attach_session_cookie(response, token)
    return TokenResponse(
        access_token="" if settings.is_production else token,
        learner=_public(learner),
    )


async def _optional_guest(
    request: Request,
    creds: HTTPAuthorizationCredentials | None,
    db: AsyncSession,
) -> Learner | None:
    token = None
    if creds is not None and creds.scheme.lower() == "bearer":
        token = creds.credentials
    if not token:
        token = request.cookies.get(settings.AUTH_COOKIE_NAME)
    if not token:
        return None
    learner_id = decode_access_token(token)
    if not learner_id:
        return None
    learner = await db.get(Learner, learner_id)
    if learner and learner.is_guest:
        return learner
    return None


async def _merge_completed_lessons(
    db: AsyncSession, learner_id: str, lesson_ids: list[str]
) -> None:
    for lesson_id in lesson_ids[:500]:
        lesson_id = str(lesson_id).strip()
        if not lesson_id:
            continue
        existing = await db.scalar(
            select(LessonCompletion).where(
                LessonCompletion.learner_id == learner_id,
                LessonCompletion.lesson_id == lesson_id,
            )
        )
        if existing:
            continue
        db.add(
            LessonCompletion(
                learner_id=learner_id,
                lesson_id=lesson_id,
                xp_awarded=0,
                accuracy=0,
            )
        )


async def _create_challenge(
    db: AsyncSession, *, learner_id: str, purpose: str
) -> tuple[AuthChallenge, str]:
    raw = issue_challenge_token()
    row = AuthChallenge(
        learner_id=learner_id,
        purpose=purpose,
        token_hash=hash_challenge_token(raw),
        expires_at=challenge_expiry(hours=2),
    )
    db.add(row)
    await db.flush()
    return row, raw


@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    request: Request,
    response: Response,
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
    cache: CacheBackend = Depends(get_redis),
) -> TokenResponse:
    await enforce_auth_rate_limit(cache, request, bucket="register")
    email = payload.email.lower()
    existing = await db.scalar(select(Learner).where(Learner.email == email))
    if existing and not existing.is_guest:
        await record_auth_failure(cache, request, bucket="register")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    guest = await _optional_guest(request, creds, db)
    if guest:
        guest.email = email
        guest.display_name = payload.display_name.strip()
        guest.preferred_language = payload.preferred_language
        guest.password_hash = hash_password(payload.password)
        guest.is_guest = False
        guest.email_verified = False
        learner = guest
    else:
        learner = Learner(
            email=email,
            display_name=payload.display_name.strip(),
            preferred_language=payload.preferred_language,
            password_hash=hash_password(payload.password),
            is_guest=False,
            email_verified=False,
        )
        db.add(learner)
        await db.flush()

    await _merge_completed_lessons(db, learner.id, payload.completed_lesson_ids)
    await _create_challenge(db, learner_id=learner.id, purpose="verify_email")
    await clear_auth_failures(cache, request, bucket="register")
    return _token_body(learner, _issued_token(learner.id), response)


@router.post("/auth/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    cache: CacheBackend = Depends(get_redis),
) -> TokenResponse:
    await enforce_auth_rate_limit(cache, request, bucket="login")
    learner = await db.scalar(select(Learner).where(Learner.email == payload.email.lower()))
    if not learner or not verify_password(payload.password, learner.password_hash):
        await record_auth_failure(cache, request, bucket="login")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    await clear_auth_failures(cache, request, bucket="login")
    return _token_body(learner, _issued_token(learner.id), response)


@router.post("/auth/guest", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def guest_session(
    payload: GuestRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    learner = Learner(
        email=None,
        display_name=payload.display_name.strip(),
        preferred_language=payload.preferred_language,
        is_guest=True,
        email_verified=False,
    )
    db.add(learner)
    await db.flush()
    return _token_body(learner, _issued_token(learner.id), response)


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    clear_session_cookie(response)


@router.post("/auth/office-unlock", response_model=OfficeUnlockResponse)
async def office_unlock(
    payload: OfficeUnlockRequest,
    request: Request,
    cache: CacheBackend = Depends(get_redis),
) -> OfficeUnlockResponse:
    await enforce_auth_rate_limit(cache, request, bucket="office")
    if not staff_key_matches(payload.passphrase):
        await record_auth_failure(cache, request, bucket="office")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    await clear_auth_failures(cache, request, bucket="office")
    return OfficeUnlockResponse(ok=True)


@router.post("/auth/password-reset/request", response_model=ChallengeIssued)
async def request_password_reset(
    payload: PasswordResetRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    cache: CacheBackend = Depends(get_redis),
) -> ChallengeIssued:
    await enforce_auth_rate_limit(cache, request, bucket="reset")
    learner = await db.scalar(select(Learner).where(Learner.email == payload.email.lower()))
    debug_token: str | None = None
    if learner and not learner.is_guest:
        _, raw = await _create_challenge(db, learner_id=learner.id, purpose="reset_password")
        if not settings.is_production:
            debug_token = raw
    await clear_auth_failures(cache, request, bucket="reset")
    return ChallengeIssued(ok=True, debug_token=debug_token)


@router.post("/auth/password-reset/confirm", response_model=ChallengeIssued)
async def confirm_password_reset(
    payload: PasswordResetConfirm,
    request: Request,
    db: AsyncSession = Depends(get_db),
    cache: CacheBackend = Depends(get_redis),
) -> ChallengeIssued:
    await enforce_auth_rate_limit(cache, request, bucket="reset")
    token_hash = hash_challenge_token(payload.token)
    row = await db.scalar(
        select(AuthChallenge).where(
            AuthChallenge.token_hash == token_hash,
            AuthChallenge.purpose == "reset_password",
        )
    )
    now = datetime.now(UTC)
    expires = row.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=UTC)
    if not row or row.consumed_at is not None or expires < now:
        await record_auth_failure(cache, request, bucket="reset")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    learner = await db.get(Learner, row.learner_id)
    if not learner:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    learner.password_hash = hash_password(payload.password)
    row.consumed_at = now
    await clear_auth_failures(cache, request, bucket="reset")
    return ChallengeIssued(ok=True)


@router.post("/auth/verify-email/request", response_model=ChallengeIssued)
async def request_email_verification(
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> ChallengeIssued:
    if learner.is_guest or not learner.email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Registered email required")
    if learner.email_verified:
        return ChallengeIssued(ok=True)
    _, raw = await _create_challenge(db, learner_id=learner.id, purpose="verify_email")
    return ChallengeIssued(ok=True, debug_token=None if settings.is_production else raw)


@router.post("/auth/verify-email/confirm", response_model=ChallengeIssued)
async def confirm_email_verification(
    payload: VerifyEmailRequest,
    db: AsyncSession = Depends(get_db),
) -> ChallengeIssued:
    token_hash = hash_challenge_token(payload.token)
    row = await db.scalar(
        select(AuthChallenge).where(
            AuthChallenge.token_hash == token_hash,
            AuthChallenge.purpose == "verify_email",
        )
    )
    now = datetime.now(UTC)
    expires = row.expires_at if row else None
    if expires is not None and expires.tzinfo is None:
        expires = expires.replace(tzinfo=UTC)
    if not row or row.consumed_at is not None or expires is None or expires < now:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    learner = await db.get(Learner, row.learner_id)
    if not learner:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    learner.email_verified = True
    row.consumed_at = now
    return ChallengeIssued(ok=True)


@router.get("/auth/me", response_model=LearnerPublic)
async def me(learner: Learner = Depends(get_current_learner)) -> LearnerPublic:
    return _public(learner)
