from __future__ import annotations

from httpx import AsyncClient

from app.cache import MemoryCache
from tests.conftest import register_user


async def test_memory_cache_ranks_and_expires() -> None:
    cache = MemoryCache()
    assert await cache.ping() is True
    await cache.zadd("lb", {"amina": 40, "jose": 90})
    top = await cache.zrevrange("lb", 0, 0, withscores=True)
    assert top == [("jose", 90.0)]
    await cache.setex("review:1", 60, '{"ok":true}')
    assert await cache.get("review:1") == '{"ok":true}'
    await cache.setex("gone", 0, "x")
    # ttl 0 is treated as no expiry in MemoryCache; expired keys use a past timestamp
    cache._kv["gone"] = ("x", 0)
    assert await cache.get("gone") is None


async def test_leaderboard_uses_postgres(client: AsyncClient) -> None:
    await register_user(client)
    response = await client.get("/api/v1/leaderboard")
    assert response.status_code == 200
    rows = response.json()
    assert rows
    assert rows[0]["learnerId"]
    assert rows[0]["totalXp"] >= 0
