from __future__ import annotations

import os

os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["SUPABASE_DB_URL"] = ""
os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("REDIS_URL", "off")

from collections.abc import AsyncGenerator, Mapping
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app.database import Base, engine
from app.main import create_app


class FakeRedis:
    def __init__(self) -> None:
        self._z: dict[str, dict[str, float]] = {}
        self._kv: dict[str, str] = {}

    async def ping(self) -> bool:
        return True

    async def zadd(self, key: str, mapping: Mapping[str, float]) -> int:
        bucket = self._z.setdefault(key, {})
        bucket.update({str(k): float(v) for k, v in mapping.items()})
        return len(mapping)

    async def zrevrange(
        self, key: str, start: int, end: int, withscores: bool = False
    ) -> list[Any]:
        items = sorted(self._z.get(key, {}).items(), key=lambda item: -item[1])
        end_i = None if end < 0 else end + 1
        sliced = items[start:end_i]
        if withscores:
            return sliced
        return [member for member, _score in sliced]

    async def setex(self, key: str, _ttl: int, value: str) -> None:
        self._kv[key] = value

    async def get(self, key: str) -> str | None:
        return self._kv.get(key)

    async def incr(self, key: str) -> int:
        value = int(self._kv.get(key) or "0") + 1
        self._kv[key] = str(value)
        return value

    async def aclose(self) -> None:
        return None


@pytest.fixture
async def app() -> AsyncGenerator[Any, None]:
    application = create_app(redis=FakeRedis())
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield application
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client(app: Any) -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def register_user(
    client: AsyncClient,
    email: str = "learner@example.com",
    password: str = "password12",
) -> dict[str, Any]:
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": password,
            "displayName": "Amina",
            "preferredLanguage": "en",
        },
    )
    assert response.status_code == 201, response.text
    body = response.json()
    client.headers["Authorization"] = f"Bearer {body['accessToken']}"
    return body
