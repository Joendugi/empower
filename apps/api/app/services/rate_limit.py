from __future__ import annotations

from fastapi import HTTPException, Request, status

from app.cache import CacheBackend

AUTH_FAIL_LIMIT = 8
AUTH_FAIL_TTL_SECONDS = 900


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip() or "unknown"
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


async def enforce_auth_rate_limit(cache: CacheBackend, request: Request, *, bucket: str) -> None:
    ip = client_ip(request)
    key = f"auth:fail:{bucket}:{ip}"
    count_raw = await cache.get(key)
    count = int(count_raw or "0")
    if count >= AUTH_FAIL_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many attempts. Try again in a few minutes.",
        )


async def record_auth_failure(cache: CacheBackend, request: Request, *, bucket: str) -> None:
    ip = client_ip(request)
    key = f"auth:fail:{bucket}:{ip}"
    if await cache.get(key) is None:
        await cache.setex(key, AUTH_FAIL_TTL_SECONDS, "0")
    await cache.incr(key)


async def clear_auth_failures(cache: CacheBackend, request: Request, *, bucket: str) -> None:
    ip = client_ip(request)
    await cache.setex(f"auth:fail:{bucket}:{ip}", 1, "0")
