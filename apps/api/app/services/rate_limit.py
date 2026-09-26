from __future__ import annotations

import time

from fastapi import HTTPException, Request, status

from app.cache import CacheBackend
from app.config import settings

AUTH_FAIL_LIMIT = 8
AUTH_FAIL_TTL_SECONDS = 900

# Paths that skip global rate limiting / timeouts must stay probe-cheap.
SKIP_PREFIXES = ("/health", "/ready", "/api/v1/health")


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip() or "unknown"
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


def should_skip_limits(path: str) -> bool:
    return any(path == prefix or path.startswith(prefix + "/") for prefix in SKIP_PREFIXES)


def _window_key(kind: str, ip: str, window_seconds: int) -> str:
    bucket = int(time.time() // max(window_seconds, 1))
    return f"rl:{kind}:{ip}:{bucket}"


async def hit_window_limit(
    cache: CacheBackend,
    *,
    kind: str,
    ip: str,
    limit: int,
    window_seconds: int = 60,
) -> int:
    """Increment the window counter and return the new count."""
    key = _window_key(kind, ip, window_seconds)
    if await cache.get(key) is None:
        await cache.setex(key, window_seconds, "0")
    return await cache.incr(key)


async def enforce_ip_rate_limit(
    cache: CacheBackend,
    request: Request,
    *,
    kind: str,
    limit: int,
    window_seconds: int = 60,
) -> None:
    if limit <= 0 or should_skip_limits(request.url.path):
        return
    count = await hit_window_limit(
        cache,
        kind=kind,
        ip=client_ip(request),
        limit=limit,
        window_seconds=window_seconds,
    )
    if count > limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Slow down and try again.",
            headers={"Retry-After": str(window_seconds)},
        )


async def enforce_request_rate_limits(cache: CacheBackend, request: Request) -> None:
    """Global API limit plus a tighter write/auth bucket."""
    path = request.url.path
    await enforce_ip_rate_limit(
        cache,
        request,
        kind="api",
        limit=settings.RATE_LIMIT_PER_MINUTE,
        window_seconds=60,
    )
    if path.startswith("/api/v1/auth/"):
        await enforce_ip_rate_limit(
            cache,
            request,
            kind="auth",
            limit=settings.RATE_LIMIT_AUTH_PER_MINUTE,
            window_seconds=60,
        )
    elif request.method in {"POST", "PUT", "PATCH", "DELETE"} and path.startswith("/api/"):
        await enforce_ip_rate_limit(
            cache,
            request,
            kind="write",
            limit=settings.RATE_LIMIT_WRITE_PER_MINUTE,
            window_seconds=60,
        )


async def enforce_auth_rate_limit(cache: CacheBackend, request: Request, *, bucket: str) -> None:
    ip = client_ip(request)
    key = f"auth:fail:{bucket}:{ip}"
    count_raw = await cache.get(key)
    count = int(count_raw or "0")
    if count >= AUTH_FAIL_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many attempts. Try again in a few minutes.",
            headers={"Retry-After": str(AUTH_FAIL_TTL_SECONDS)},
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
