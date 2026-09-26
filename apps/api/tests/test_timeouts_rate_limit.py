from __future__ import annotations

import asyncio

import pytest
from httpx import ASGITransport, AsyncClient

from app.config import settings


@pytest.mark.asyncio
async def test_global_rate_limit_returns_429(app, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "RATE_LIMIT_PER_MINUTE", 3)
    monkeypatch.setattr(settings, "RATE_LIMIT_AUTH_PER_MINUTE", 100)
    monkeypatch.setattr(settings, "RATE_LIMIT_WRITE_PER_MINUTE", 100)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        statuses = [ (await client.get("/api/v1/skill-paths")).status_code for _ in range(5) ]
        assert statuses[:3] == [401, 401, 401]
        assert statuses[3:] == [429, 429]
        limited = await client.get("/api/v1/skill-paths")
        assert limited.status_code == 429
        assert limited.headers.get("retry-after") == "60"


@pytest.mark.asyncio
async def test_health_skips_rate_limit_and_timeout(app, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "RATE_LIMIT_PER_MINUTE", 1)
    monkeypatch.setattr(settings, "REQUEST_TIMEOUT_SECONDS", 0.01)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        for _ in range(5):
            response = await client.get("/health")
            assert response.status_code == 200


@pytest.mark.asyncio
async def test_request_timeout_returns_504(app, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "REQUEST_TIMEOUT_SECONDS", 0.05)
    monkeypatch.setattr(settings, "RATE_LIMIT_PER_MINUTE", 10_000)

    @app.get("/api/v1/_slow")
    async def _slow() -> dict[str, str]:
        await asyncio.sleep(1.0)
        return {"ok": "late"}

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/_slow")
        assert response.status_code == 504
        assert response.json()["detail"] == "Request timed out"
