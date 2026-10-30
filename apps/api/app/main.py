from __future__ import annotations

import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import redis.asyncio as aioredis
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from starlette.exceptions import HTTPException as StarletteHTTPException

import app.models  # noqa: F401 — register models on Base.metadata
from app.config import settings
from app.database import AsyncSessionLocal, Base, engine
from app.edge import OriginVerifyMiddleware, ProbeAwareTrustedHostMiddleware
from app.middleware import TimeoutRateLimitMiddleware
from app.migrate import run_alembic_upgrade
from app.routers import (
    accounts,
    analytics,
    auth,
    badges,
    certificates,
    content,
    ctfd,
    discussions,
    leaderboard,
    library,
    lti,
    moderation,
    notices,
    ops,
    review,
    rubrics,
    streaks,
    studio,
    submissions,
    sync,
    xp,
)
from app.security import assert_secure_settings
from app.services.published_catalog import load_published_snapshot

logger = logging.getLogger(__name__)


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

    if settings.DATABASE_URL.startswith("sqlite") or settings.ENVIRONMENT == "development":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    elif settings.RUN_MIGRATIONS_ON_STARTUP:
        await asyncio.to_thread(run_alembic_upgrade)

    await _reload_published()
    refresher = asyncio.create_task(_refresh_published_forever())

    yield

    refresher.cancel()
    if started_redis:
        await app.state.redis.aclose()


async def _reload_published() -> None:
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
        logger.warning("Could not load published lessons", exc_info=True)


async def _refresh_published_forever() -> None:
    """Pick up lessons another pod published. Each pod keeps its own copy in memory."""
    interval = settings.PUBLISHED_REFRESH_SECONDS
    if interval <= 0:
        return
    while True:
        await asyncio.sleep(interval)
        await _reload_published()


def _init_sentry() -> None:
    if not settings.SENTRY_DSN:
        return
    import sentry_sdk

    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        release=settings.APP_VERSION,
        traces_sample_rate=settings.SENTRY_TRACES_SAMPLE_RATE,
        send_default_pii=False,
    )


def create_app(**state: Any) -> FastAPI:
    _init_sentry()
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
        app.add_middleware(ProbeAwareTrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)
    if settings.ORIGIN_VERIFY_SECRET:
        app.add_middleware(OriginVerifyMiddleware, secret=settings.ORIGIN_VERIFY_SECRET)

    @app.exception_handler(Exception)
    async def hide_unhandled_errors(_request: Request, exc: Exception) -> JSONResponse:
        if isinstance(exc, (HTTPException, StarletteHTTPException)):
            raise exc
        if settings.is_production:
            return JSONResponse({"detail": "Internal server error"}, status_code=500)
        raise exc

    app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
    app.include_router(accounts.router, prefix="/api/v1", tags=["Accounts"])
    app.include_router(xp.router, prefix="/api/v1", tags=["XP"])
    app.include_router(streaks.router, prefix="/api/v1", tags=["Streaks"])
    app.include_router(badges.router, prefix="/api/v1", tags=["Badges"])
    app.include_router(certificates.router, prefix="/api/v1", tags=["Certificates"])
    app.include_router(leaderboard.router, prefix="/api/v1", tags=["Leaderboard"])
    app.include_router(review.router, prefix="/api/v1", tags=["Review"])
    app.include_router(content.router, prefix="/api/v1", tags=["Content"])
    app.include_router(submissions.router, prefix="/api/v1", tags=["Submissions"])
    app.include_router(sync.router, prefix="/api/v1", tags=["Sync"])
    app.include_router(studio.router, prefix="/api/v1", tags=["Studio"])
    app.include_router(moderation.router, prefix="/api/v1", tags=["Moderation"])
    app.include_router(analytics.router, prefix="/api/v1", tags=["Analytics"])
    app.include_router(ops.router, prefix="/api/v1", tags=["Ops"])
    app.include_router(notices.router, prefix="/api/v1", tags=["Notices"])
    app.include_router(discussions.router, prefix="/api/v1", tags=["Discussions"])
    app.include_router(rubrics.router, prefix="/api/v1", tags=["Rubrics"])
    app.include_router(library.router, prefix="/api/v1", tags=["Library"])
    app.include_router(ctfd.router, prefix="/api/v1", tags=["CTFd"])
    app.include_router(lti.router, tags=["LTI"])

    def _health() -> dict[str, str]:
        return {"status": "ok", "version": settings.APP_VERSION, "environment": settings.ENVIRONMENT}

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
            "version": settings.APP_VERSION,
            "database": "ok",
            "cache": "redis" if settings.redis_enabled else "memory",
            "redis": "ok" if settings.redis_enabled and redis is not None else "skipped",
        }

    return app


app = create_app()
