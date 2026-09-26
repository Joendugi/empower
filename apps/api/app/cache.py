from __future__ import annotations

import time
from collections.abc import Mapping
from typing import Any, Protocol


class CacheBackend(Protocol):
    async def ping(self) -> bool: ...

    async def zadd(self, key: str, mapping: Mapping[str, float]) -> int: ...

    async def zrevrange(
        self, key: str, start: int, end: int, withscores: bool = False
    ) -> list[Any]: ...

    async def setex(self, key: str, ttl: int, value: str) -> None: ...

    async def get(self, key: str) -> str | None: ...

    async def incr(self, key: str) -> int: ...

    async def aclose(self) -> None: ...


class MemoryCache:
    """Process-local Redis stand-in. Free, no extra host. Fine for one API replica."""

    def __init__(self) -> None:
        self._z: dict[str, dict[str, float]] = {}
        self._kv: dict[str, tuple[str, float | None]] = {}

    async def ping(self) -> bool:
        return True

    async def zadd(self, key: str, mapping: Mapping[str, float]) -> int:
        bucket = self._z.setdefault(key, {})
        bucket.update({str(member): float(score) for member, score in mapping.items()})
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

    async def setex(self, key: str, ttl: int, value: str) -> None:
        expires = time.time() + ttl if ttl > 0 else None
        self._kv[key] = (value, expires)

    async def get(self, key: str) -> str | None:
        item = self._kv.get(key)
        if item is None:
            return None
        value, expires = item
        if expires is not None and time.time() > expires:
            self._kv.pop(key, None)
            return None
        return value

    async def incr(self, key: str) -> int:
        current = await self.get(key)
        next_value = int(current or "0") + 1
        # Keep the existing TTL window if present; otherwise 15 minutes.
        item = self._kv.get(key)
        ttl = 900
        if item is not None and item[1] is not None:
            ttl = max(1, int(item[1] - time.time()))
        await self.setex(key, ttl, str(next_value))
        return next_value

    async def aclose(self) -> None:
        return None


class RedisCacheAdapter:
    """Thin wrapper so Redis clients expose the same CacheBackend surface."""

    def __init__(self, client: Any) -> None:
        self._client = client

    async def ping(self) -> bool:
        return bool(await self._client.ping())

    async def zadd(self, key: str, mapping: Mapping[str, float]) -> int:
        return int(await self._client.zadd(key, mapping))

    async def zrevrange(
        self, key: str, start: int, end: int, withscores: bool = False
    ) -> list[Any]:
        return list(await self._client.zrevrange(key, start, end, withscores=withscores))

    async def setex(self, key: str, ttl: int, value: str) -> None:
        await self._client.setex(key, ttl, value)

    async def get(self, key: str) -> str | None:
        value = await self._client.get(key)
        return None if value is None else str(value)

    async def incr(self, key: str) -> int:
        if await self._client.ttl(key) < 0:
            await self._client.setex(key, 900, "0")
        return int(await self._client.incr(key))

    async def aclose(self) -> None:
        await self._client.aclose()
