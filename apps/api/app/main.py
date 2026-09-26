from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import redis.asyncio as aioredis
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.trustedhost import TrustedHostMiddleware

import app.models  # noqa: F401 — register models on Base.metadata
from app.config import settings
from app.database import AsyncSessionLocal, Base, engine
from app.middleware import TimeoutRateLimitMiddleware
from app.migrate import run_alembic_upgrade
from app.routers import analytics, auth, badges, certificates, content, leaderboard, moderation, ops, review, streaks, studio, submissions, xp
from app.security import assert_secure_settings
from app.services.published_catalog import load_published_snapshot


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    assert_secure_settings()
    started_redis = False
    if getattr(app.state, "redis", None) is None:
        if settings.redis_enabled:
            from app.cache import RedisCacheAdapter

            raw = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                max_connections=20,
            )
            app.state.redis = RedisCacheAdapter(raw)
            started_redis = True
        else:
            from app.cache import MemoryCache

            app.state.redis = MemoryCache()

    if settings.is_production and not settings.DATABASE_URL.startswith("sqlite"):
        await asyncio.to_thread(run_alembic_upgrade)
    elif settings.ENVIRONMENT == "development" or settings.DATABASE_URL.startswith("sqlite"):
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    try:
        from sqlalchemy import select

        from app.models.studio import PublishedLesson, PublishedPath

        async with AsyncSessionLocal() as session:
            lessons = (await session.scalars(select(PublishedLesson))).all()
            paths = (await session.scalars(select(PublishedPath))).all()
            load_published_snapshot(
                [{"raw_json": row.raw_json, "public_json": row.public_json} for row in lessons],
                [{"payload_json": row.payload_json} for row in paths],
            )
    except Exception:
        pass

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

    # Outer middlewares run first on the way in (Starlette order).
    app.add_middleware(TimeoutRateLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    if settings.is_production:
        app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)

    @app.exception_handler(Exception)
    async def hide_unhandled_errors(_request: Request, exc: Exception) -> JSONResponse:
        if isinstance(exc, (HTTPException, StarletteHTTPException)):
            raise exc
        if settings.is_production:
            return JSONResponse({"detail": "Internal server error"}, status_code=500)
        raise exc

    app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
    app.include_router(xp.router, prefix="/api/v1", tags=["XP"])
    app.include_router(streaks.router, prefix="/api/v1", tags=["Streaks"])
    app.include_router(badges.router, prefix="/api/v1", tags=["Badges"])
    app.include_router(certificates.router, prefix="/api/v1", tags=["Certificates"])
    app.include_router(leaderboard.router, prefix="/api/v1", tags=["Leaderboard"])
    app.include_router(review.router, prefix="/api/v1", tags=["Review"])
    app.include_router(content.router, prefix="/api/v1", tags=["Content"])
    app.include_router(submissions.router, prefix="/api/v1", tags=["Submissions"])
    app.include_router(studio.router, prefix="/api/v1", tags=["Studio"])
    app.include_router(moderation.router, prefix="/api/v1", tags=["Moderation"])
    app.include_router(analytics.router, prefix="/api/v1", tags=["Analytics"])
    app.include_router(ops.router, prefix="/api/v1", tags=["Ops"])

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
            "cache": "redis" if settings.redis_enabled else "memory",
            "redis": "ok" if settings.redis_enabled and redis is not None else "skipped",
        }

    return app


app = create_app()
