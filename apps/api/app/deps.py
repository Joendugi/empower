from __future__ import annotations

import redis.asyncio as aioredis
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.learner import Learner
from app.services.auth import decode_access_token

_bearer = HTTPBearer(auto_error=False)


def get_redis(request: Request) -> aioredis.Redis:
    redis = getattr(request.app.state, "redis", None)
    if redis is None:
        raise RuntimeError("Redis pool not initialised — app not started yet")
    return redis


async def get_current_learner(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> Learner:
    token = None
    if creds is not None and creds.scheme.lower() == "bearer":
        token = creds.credentials
    if not token:
        token = request.cookies.get(settings.AUTH_COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    learner_id = decode_access_token(token)
    if not learner_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    learner = await db.get(Learner, learner_id)
    if not learner:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Learner not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return learner


async def get_current_registered_learner(
    learner: Learner = Depends(get_current_learner),
) -> Learner:
    if learner.is_guest or not learner.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="A registered account is required to access curriculum",
        )
    return learner


def assert_self(learner: Learner, learner_id: str) -> None:
    if learner.id != learner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot act on another learner",
        )
