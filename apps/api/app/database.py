from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import StaticPool

from app.config import settings

connect_args: dict[str, object] = {}
engine_kwargs: dict[str, object] = {
    "echo": settings.ENVIRONMENT == "development",
    "pool_pre_ping": True,
}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine_kwargs["connect_args"] = connect_args
    if ":memory:" in settings.DATABASE_URL:
        engine_kwargs["poolclass"] = StaticPool
else:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    if settings.is_supabase:
        import ssl

        try:
            import certifi

            ssl_context = ssl.create_default_context(cafile=certifi.where())
        except ImportError:
            ssl_context = ssl.create_default_context()
        if settings.SUPABASE_SSL_INSECURE:
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
        supabase_args: dict[str, object] = {"ssl": ssl_context}
        if settings.uses_supabase_pooler:
            supabase_args["statement_cache_size"] = 0
        engine_kwargs["connect_args"] = supabase_args

engine = create_async_engine(settings.DATABASE_URL, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Shared declarative base for all SQLAlchemy models."""

    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency — yields an async database session per request.
    Commits on success, rolls back on exception.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
