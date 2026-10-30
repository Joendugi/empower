"""Server-first sign-in: short access tokens, rotating refresh tokens, server-owned roles."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from httpx import AsyncClient
from sqlalchemy import update

from app.database import AsyncSessionLocal
from app.models.learner import Learner
from app.models.refresh_token import RefreshToken
from app.services.sessions import hash_refresh_token
from tests.conftest import register_user

REFRESH = "empower_refresh"


def _use_refresh_cookie(client: AsyncClient, raw: str) -> None:
    client.cookies.delete(REFRESH)
    client.cookies.set(REFRESH, raw, path="/api/v1/auth")


async def _age_last_use(raw: str, seconds: int) -> None:
    async with AsyncSessionLocal() as db:
        await db.execute(
            update(RefreshToken)
            .where(RefreshToken.token_hash == hash_refresh_token(raw))
            .values(used_at=datetime.now(UTC) - timedelta(seconds=seconds))
        )
        await db.commit()


async def test_sign_in_sets_short_access_and_long_refresh(client: AsyncClient) -> None:
    body = await register_user(client)
    assert client.cookies.get(REFRESH)
    expires = datetime.fromisoformat(body["sessionExpiresAt"])
    assert expires - datetime.now(UTC) > timedelta(days=29)


async def test_refresh_rotates_and_old_token_is_refused_later(client: AsyncClient) -> None:
    await register_user(client)
    first = client.cookies.get(REFRESH)

    rotated = await client.post("/api/v1/auth/refresh")
    assert rotated.status_code == 200
    assert rotated.json()["learner"]["email"] == "learner@example.com"
    second = client.cookies.get(REFRESH)
    assert second and second != first

    # Two tabs refreshing together present the same token: allowed within the grace window.
    _use_refresh_cookie(client, first)
    assert (await client.post("/api/v1/auth/refresh")).status_code == 200

    # Long after rotation, the old token coming back means a copy leaked: end the whole sign-in.
    await _age_last_use(first, 120)
    _use_refresh_cookie(client, first)
    assert (await client.post("/api/v1/auth/refresh")).status_code == 401
    _use_refresh_cookie(client, second)
    assert (await client.post("/api/v1/auth/refresh")).status_code == 401


async def test_logout_revokes_refresh_token(client: AsyncClient) -> None:
    await register_user(client)
    raw = client.cookies.get(REFRESH)
    assert (await client.post("/api/v1/auth/logout")).status_code == 204
    _use_refresh_cookie(client, raw)
    assert (await client.post("/api/v1/auth/refresh")).status_code == 401


async def test_refresh_without_cookie_is_401(client: AsyncClient) -> None:
    assert (await client.post("/api/v1/auth/refresh")).status_code == 401


async def test_password_reset_ends_existing_sessions(client: AsyncClient) -> None:
    await register_user(client)
    raw = client.cookies.get(REFRESH)
    issued = await client.post("/api/v1/auth/password-reset/request", json={"email": "learner@example.com"})
    token = issued.json()["debugToken"]
    confirmed = await client.post(
        "/api/v1/auth/password-reset/confirm", json={"token": token, "password": "new-password-1"}
    )
    assert confirmed.status_code == 200
    _use_refresh_cookie(client, raw)
    assert (await client.post("/api/v1/auth/refresh")).status_code == 401


async def test_unknown_reset_code_is_400_not_500(client: AsyncClient) -> None:
    res = await client.post(
        "/api/v1/auth/password-reset/confirm", json={"token": "x" * 30, "password": "new-password-1"}
    )
    assert res.status_code == 400


async def test_refresh_token_is_not_an_access_token(client: AsyncClient) -> None:
    await register_user(client)
    raw = client.cookies.get(REFRESH)
    client.headers["Authorization"] = f"Bearer {raw}"
    client.cookies.delete("empower_session")
    assert (await client.get("/api/v1/auth/me")).status_code == 401


async def _make_admin(email: str) -> None:
    async with AsyncSessionLocal() as db:
        await db.execute(update(Learner).where(Learner.email == email).values(role="admin"))
        await db.commit()


async def test_only_admins_change_roles_and_change_signs_target_out(client: AsyncClient) -> None:
    target = await register_user(client, email="teacher@example.com")
    target_refresh = client.cookies.get(REFRESH)
    target_id = target["learner"]["id"]

    await register_user(client, email="boss@example.com")
    path = f"/api/v1/admin/accounts/{target_id}/role"
    assert (await client.patch(path, json={"role": "educator"})).status_code == 403

    await _make_admin("boss@example.com")
    listed = await client.get("/api/v1/admin/accounts", params={"q": "teacher"})
    assert [a["email"] for a in listed.json()] == ["teacher@example.com"]

    changed = await client.patch(path, json={"role": "educator"})
    assert changed.status_code == 200
    assert changed.json()["role"] == "educator"
    assert (await client.patch(path, json={"role": "owner"})).status_code == 422

    _use_refresh_cookie(client, target_refresh)
    assert (await client.post("/api/v1/auth/refresh")).status_code == 401


async def test_admin_cannot_demote_self(client: AsyncClient) -> None:
    me = await register_user(client, email="boss@example.com")
    await _make_admin("boss@example.com")
    res = await client.patch(f"/api/v1/admin/accounts/{me['learner']['id']}/role", json={"role": "learner"})
    assert res.status_code == 400


async def test_staff_key_can_assign_first_admin(client: AsyncClient, as_staff: None) -> None:
    target = await register_user(client, email="new-admin@example.com")
    await register_user(client, email="owner@example.com")  # the client now acts as this account
    res = await client.patch(f"/api/v1/admin/accounts/{target['learner']['id']}/role", json={"role": "admin"})
    assert res.status_code == 200
    me = await client.get("/api/v1/auth/me")
    assert me.json()["role"] == "learner"  # the caller's own role didn't change
