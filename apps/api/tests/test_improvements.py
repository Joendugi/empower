from __future__ import annotations

from httpx import AsyncClient

from tests.conftest import register_user


async def test_guest_register_keeps_progress(client: AsyncClient) -> None:
    guest = await client.post("/api/v1/auth/guest", json={"displayName": "Guest Joe"})
    assert guest.status_code == 201
    guest_id = guest.json()["learner"]["id"]

    upgraded = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "guest-upgrade@example.com",
            "password": "password12",
            "displayName": "Guest Joe",
            "completedLessonIds": ["week-solar-1", "week-solar-2"],
        },
    )
    assert upgraded.status_code == 201
    body = upgraded.json()
    assert body["learner"]["isGuest"] is False
    assert body["learner"]["id"] == guest_id
    assert body["learner"]["email"] == "guest-upgrade@example.com"

    progress = await client.get("/api/v1/progress/me")
    assert progress.status_code == 200
    assert set(progress.json()["completedLessonIds"]) >= {"week-solar-1", "week-solar-2"}


async def test_password_reset_round_trip(client: AsyncClient) -> None:
    await register_user(client, email="reset@example.com", password="password12")
    client.headers.pop("Authorization", None)

    requested = await client.post(
        "/api/v1/auth/password-reset/request",
        json={"email": "reset@example.com"},
    )
    assert requested.status_code == 200
    token = requested.json()["debugToken"]
    assert token

    confirmed = await client.post(
        "/api/v1/auth/password-reset/confirm",
        json={"token": token, "password": "password99"},
    )
    assert confirmed.status_code == 200

    bad = await client.post(
        "/api/v1/auth/login",
        json={"email": "reset@example.com", "password": "password12"},
    )
    assert bad.status_code == 401

    good = await client.post(
        "/api/v1/auth/login",
        json={"email": "reset@example.com", "password": "password99"},
    )
    assert good.status_code == 200


async def test_auth_rate_limit_locks_after_failures(client: AsyncClient) -> None:
    for _ in range(8):
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "missing@example.com", "password": "wrong-pass"},
        )
        assert response.status_code in {401, 429}
    locked = await client.post(
        "/api/v1/auth/login",
        json={"email": "missing@example.com", "password": "wrong-pass"},
    )
    assert locked.status_code == 429


async def test_claim_certificate_when_weeks_complete(client: AsyncClient) -> None:
    created = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "cert@example.com",
            "password": "password12",
            "displayName": "Cert Learner",
            "completedLessonIds": ["cert-week-1", "cert-week-2"],
        },
    )
    assert created.status_code == 201
    client.headers["Authorization"] = f"Bearer {created.json()['accessToken']}"

    claimed = await client.post(
        "/api/v1/certificates/claim",
        json={
            "pathId": "demo-path",
            "pathTitle": "Demo programme",
            "lessonIds": ["cert-week-1", "cert-week-2"],
        },
    )
    assert claimed.status_code == 201
    assert claimed.json()["badgeType"] == "cert:demo-path"
    assert claimed.json()["openBadge"]["type"]

    listed = await client.get("/api/v1/certificates/me")
    assert listed.status_code == 200
    assert any(item["badgeType"] == "cert:demo-path" for item in listed.json())

    cert_id = claimed.json()["id"]
    client.headers.pop("Authorization", None)
    public = await client.get(f"/api/v1/certificates/{cert_id}")
    assert public.status_code == 200
    assertion = public.json()
    assert assertion["id"].endswith(f"/certificates/{cert_id}")
    assert assertion["credentialSubject"]["name"] == "Cert Learner"
    assert assertion["empower"]["verifyUrl"].endswith(f"/verify/{cert_id}")

    pdf = await client.get(f"/api/v1/certificates/{cert_id}/pdf")
    assert pdf.status_code == 200
    assert pdf.headers["content-type"].startswith("application/pdf")
    assert pdf.content.startswith(b"%PDF")

    missing = await client.get("/api/v1/certificates/not-a-real-cert")
    assert missing.status_code == 404
