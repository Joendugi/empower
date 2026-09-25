from __future__ import annotations

from httpx import AsyncClient

from tests.conftest import register_user


async def test_register_login_and_me(client: AsyncClient) -> None:
    created = await register_user(client)
    assert created["learner"]["displayName"] == "Amina"
    assert created["learner"]["isGuest"] is False

    me = await client.get("api/v1/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == "learner@example.com"

    client.headers.pop("Authorization", None)
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": "learner@example.com", "password": "password12"},
    )
    assert login.status_code == 200
    assert "accessToken" in login.json()


async def test_guest_session(client: AsyncClient) -> None:
    response = await client.post("/api/v1/auth/guest", json={"displayName": "Guest Learner"})
    assert response.status_code == 201
    assert response.json()["learner"]["isGuest"] is True


async def test_protected_route_requires_auth(client: AsyncClient) -> None:
    response = await client.get("/api/v1/xp/me")
    assert response.status_code == 401


async def test_me_accepts_http_only_cookie(client: AsyncClient) -> None:
    await register_user(client)
    client.headers.pop("Authorization", None)
    me = await client.get("/api/v1/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == "learner@example.com"


async def test_office_unlock_looks_like_404(client: AsyncClient, monkeypatch) -> None:
    from app.config import settings

    monkeypatch.setattr(settings, "ADMIN_STAFF_KEY", "dev-office-key-change-me")
    denied = await client.post(
        "/api/v1/auth/office-unlock",
        json={"passphrase": "wrong-office-key-xx", "email": "hod@poly.ac.ke"},
    )
    assert denied.status_code == 404
    allowed = await client.post(
        "/api/v1/auth/office-unlock",
        json={"passphrase": "dev-office-key-change-me", "email": "hod@poly.ac.ke"},
    )
    assert allowed.status_code == 200


async def test_logout_clears_cookie(client: AsyncClient) -> None:
    await register_user(client)
    client.headers.pop("Authorization", None)
    gone = await client.post("/api/v1/auth/logout")
    assert gone.status_code == 204
    me = await client.get("/api/v1/auth/me")
    assert me.status_code == 401


async def test_duplicate_email_conflict(client: AsyncClient) -> None:
    await register_user(client)
    client.headers.pop("Authorization", None)
    again = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "learner@example.com",
            "password": "password12",
            "displayName": "Other",
        },
    )
    assert again.status_code == 409
