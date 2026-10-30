"""ASGI middleware for running behind CloudFront and a load balancer."""

from __future__ import annotations

import hmac

from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send

# Kubelet and load-balancer health checks use the pod IP as Host and don't pass through CloudFront.
PROBE_PATHS = frozenset({"/health", "/ready"})


class ProbeAwareTrustedHostMiddleware(TrustedHostMiddleware):
    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http" and scope["path"] in PROBE_PATHS:
            await self.app(scope, receive, send)
            return
        await super().__call__(scope, receive, send)


class OriginVerifyMiddleware:
    """Refuse requests that didn't come through CloudFront (which adds a secret header)."""

    def __init__(self, app: ASGIApp, secret: str, header: str = "x-origin-verify") -> None:
        self.app = app
        self.secret = secret.encode()
        self.header = header.encode()

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or scope["path"] in PROBE_PATHS:
            await self.app(scope, receive, send)
            return
        supplied = next((value for key, value in scope["headers"] if key == self.header), b"")
        if not hmac.compare_digest(supplied, self.secret):
            await JSONResponse({"detail": "Forbidden"}, status_code=403)(scope, receive, send)
            return
        await self.app(scope, receive, send)
