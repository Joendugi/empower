from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.deps import get_current_learner
from app.models.learner import Learner
from app.schemas import CamelModel
from app.security import attach_session_cookie, clear_session_cookie, staff_key_matches
from app.services.auth import create_access_token, hash_password, verify_password

router = APIRouter()


class RegisterRequest(CamelModel):
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(min_length=8, max_length=128)
    display_name: str = Field(min_length=1, max_length=100)
    preferred_language: str = Field(default="en", pattern="^(en|sw)$")


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


class TokenResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"
    learner: LearnerPublic


class OfficeUnlockRequest(CamelModel):
    passphrase: str = Field(min_length=10, max_length=200)
    email: str = Field(min_length=3, max_length=320)


class OfficeUnlockResponse(CamelModel):
    ok: bool = True


def _public(learner: Learner) -> LearnerPublic:
    return LearnerPublic(
        id=learner.id,
        email=learner.email,
        display_name=learner.display_name,
        preferred_language=learner.preferred_language,
        total_xp=learner.total_xp,
        level=learner.level,
        is_guest=learner.is_guest,
    )


def _issued_token(learner_id: str) -> str:
    return create_access_token(learner_id)


def _token_body(learner: Learner, token: str, response: Response) -> TokenResponse:
    attach_session_cookie(response, token)
    return TokenResponse(
        access_token="" if settings.is_production else token,
        learner=_public(learner),
    )


@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    existing = await db.scalar(select(Learner).where(Learner.email == payload.email.lower()))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    learner = Learner(
        email=payload.email.lower(),
        display_name=payload.display_name.strip(),
        preferred_language=payload.preferred_language,
        password_hash=hash_password(payload.password),
        is_guest=False,
    )
    db.add(learner)
    await db.flush()
    return _token_body(learner, _issued_token(learner.id), response)


@router.post("/auth/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    learner = await db.scalar(select(Learner).where(Learner.email == payload.email.lower()))
    if not learner or not verify_password(payload.password, learner.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
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
    )
    db.add(learner)
    await db.flush()
    return _token_body(learner, _issued_token(learner.id), response)


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    clear_session_cookie(response)


@router.post("/auth/office-unlock", response_model=OfficeUnlockResponse)
async def office_unlock(payload: OfficeUnlockRequest) -> OfficeUnlockResponse:
    if not staff_key_matches(payload.passphrase):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return OfficeUnlockResponse(ok=True)


@router.get("/auth/me", response_model=LearnerPublic)
async def me(learner: Learner = Depends(get_current_learner)) -> LearnerPublic:
    return _public(learner)
