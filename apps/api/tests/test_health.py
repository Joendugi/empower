from __future__ import annotations

from httpx import AsyncClient


async def test_health(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


async def test_ready(client: AsyncClient) -> None:
    response = await client.get("/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"


async def test_edx_status_disabled_without_key(client: AsyncClient) -> None:
    response = await client.get("/api/v1/edx/status")
    assert response.status_code == 200
    assert response.json()["enabled"] is False
