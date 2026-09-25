from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import redis.asyncio as aioredis
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

import app.models  # noqa: F401 — register models on Base.metadata
from app.config import settings
from app.database import Base, engine
from app.routers import auth, badges, content, leaderboard, review, streaks, submissions, xp
from app.security import assert_secure_settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    assert_secure_settings()
    started_redis = False
    if getattr(app.state, "redis", None) is None and settings.redis_enabled:
        app.state.redis = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=20,
        )
        started_redis = True

    if settings.ENVIRONMENT == "development" or settings.DATABASE_URL.startswith("sqlite"):
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    yield

    if started_redis:
        await app.state.redis.aclose()


def create_app(**state: Any) -> FastAPI:
    docs_enabled = settings.ENVIRONMENT != "production"
    app = FastAPI(
        title="CyberLearn Gamification API",
        version="0.1.0",
        description="XP, streaks, badges, spaced-repetition (FSRS), content, and leaderboards for CyberLearn.",
        lifespan=lifespan,
        docs_url="/docs" if docs_enabled else None,
        redoc_url="/redoc" if docs_enabled else None,
        openapi_url="/openapi.json" if docs_enabled else None,
    )
    for key, value in state.items():
        setattr(app.state, key, value)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
    app.include_router(xp.router, prefix="/api/v1", tags=["XP"])
    app.include_router(streaks.router, prefix="/api/v1", tags=["Streaks"])
    app.include_router(badges.router, prefix="/api/v1", tags=["Badges"])
    app.include_router(leaderboard.router, prefix="/api/v1", tags=["Leaderboard"])
    app.include_router(review.router, prefix="/api/v1", tags=["Review"])
    app.include_router(content.router, prefix="/api/v1", tags=["Content"])
    app.include_router(submissions.router, prefix="/api/v1", tags=["Submissions"])

    def _health() -> dict[str, str]:
        return {"status": "ok", "version": "0.1.0", "environment": settings.ENVIRONMENT}

    @app.get("/health", tags=["Health"])
    async def health_check() -> dict[str, str]:
        return _health()

    @app.get("/api/v1/health", tags=["Health"])
    async def api_health_check() -> dict[str, str]:
        return _health()

    @app.get("/ready", tags=["Health"])
    async def readiness(request: Request) -> dict[str, str]:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        redis = getattr(request.app.state, "redis", None)
        if redis is not None:
            await redis.ping()
        return {
            "status": "ready",
            "version": "0.1.0",
            "database": "ok",
            "redis": "ok" if redis is not None else "skipped",
        }

    return app


app = create_app()
