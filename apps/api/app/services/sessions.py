"""Sign-in sessions: a short-lived access token plus a rotating refresh token.

The access token (JWT, ACCESS_TOKEN_EXPIRE_MINUTES) goes in an httpOnly cookie and
proves who the learner is on every request. The refresh token (random, stored hashed)
goes in a second httpOnly cookie that browsers send only to /api/v1/auth, and buys a
new pair when the access token runs out. Roles are never in either token: every
request reads the learner's role from the database, so a role change applies at once.
"""

from __future__ import annotations

import hashlib
import secrets
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from fastapi import Request, Response
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.learner import Learner
from app.models.refresh_token import RefreshToken
from app.services.auth import create_access_token

REFRESH_COOKIE_PATH = "/api/v1/auth"
# Two tabs refreshing at the same moment both present the same token. Within this
# window a second use is treated as that race, not as theft.
REUSE_GRACE_SECONDS = 30


@dataclass
class IssuedSession:
    access_token: str
    refresh_token: str
    refresh_expires_at: datetime


class RefreshRejected(Exception):
    pass


def hash_refresh_token(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _aware(value: datetime) -> datetime:
    return value if value.tzinfo else value.replace(tzinfo=UTC)


async def issue_session(
    db: AsyncSession, learner: Learner, request: Request, *, family_id: str | None = None
) -> IssuedSession:
    raw = secrets.token_urlsafe(48)
    expires = datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(
        RefreshToken(
            learner_id=learner.id,
            family_id=family_id or str(uuid.uuid4()),
            token_hash=hash_refresh_token(raw),
            user_agent=(request.headers.get("user-agent") or "")[:300],
            expires_at=expires,
        )
    )
    await db.flush()
    return IssuedSession(create_access_token(learner.id), raw, expires)


async def rotate_session(db: AsyncSession, raw: str, request: Request) -> tuple[Learner, IssuedSession]:
    """Exchange a refresh token for a new pair. Raises RefreshRejected."""
    now = datetime.now(UTC)
    row = await db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(raw)))
    if row is None or row.revoked_at is not None or _aware(row.expires_at) <= now:
        raise RefreshRejected
    if row.used_at is not None and (now - _aware(row.used_at)).total_seconds() > REUSE_GRACE_SECONDS:
        # A rotated-out token came back: someone else holds a copy. End every session from this sign-in.
        await revoke_family(db, row.family_id)
        await db.commit()
        raise RefreshRejected
    learner = await db.get(Learner, row.learner_id)
    if learner is None:
        raise RefreshRejected
    row.used_at = row.used_at or now
    return learner, await issue_session(db, learner, request, family_id=row.family_id)


async def revoke_family(db: AsyncSession, family_id: str) -> None:
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.family_id == family_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=datetime.now(UTC))
    )


async def revoke_by_raw_token(db: AsyncSession, raw: str) -> None:
    row = await db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(raw)))
    if row is not None:
        await revoke_family(db, row.family_id)


async def revoke_all_for_learner(db: AsyncSession, learner_id: str) -> None:
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.learner_id == learner_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=datetime.now(UTC))
    )


def attach_session_cookies(response: Response, session: IssuedSession) -> None:
    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=session.access_token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )
    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        value=session.refresh_token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86_400,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="strict",
        path=REFRESH_COOKIE_PATH,
    )


def clear_session_cookies(response: Response) -> None:
    for name, path in ((settings.AUTH_COOKIE_NAME, "/"), (settings.REFRESH_COOKIE_NAME, REFRESH_COOKIE_PATH)):
        response.delete_cookie(key=name, path=path, secure=settings.cookie_secure, httponly=True, samesite="lax")
