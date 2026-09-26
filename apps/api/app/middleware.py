from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.services.rate_limit import enforce_request_rate_limits, should_skip_limits


class TimeoutRateLimitMiddleware(BaseHTTPMiddleware):
    """Enforce per-IP rate limits and a hard request timeout."""

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        path = request.url.path
        cache = getattr(request.app.state, "redis", None)

        if cache is not None and not should_skip_limits(path):
            try:
                await enforce_request_rate_limits(cache, request)
            except Exception as exc:  # HTTPException from enforce_*
                from fastapi import HTTPException

                if isinstance(exc, HTTPException):
                    return JSONResponse(
                        {"detail": exc.detail},
                        status_code=exc.status_code,
                        headers=dict(exc.headers or {}),
                    )
                raise

        timeout = float(settings.REQUEST_TIMEOUT_SECONDS)
        if timeout <= 0 or should_skip_limits(path):
            return await call_next(request)

        try:
            return await asyncio.wait_for(call_next(request), timeout=timeout)
        except asyncio.TimeoutError:
            return JSONResponse(
                {"detail": "Request timed out"},
                status_code=504,
                headers={"Connection": "close"},
            )
