from __future__ import annotations

import base64
import json
from typing import Any

import pytest
from httpx import AsyncClient

from app.config import settings
from tests.conftest import register_user


@pytest.mark.asyncio
async def test_ctfd_status_and_challenges(client: AsyncClient) -> None:
    # 1. Status endpoint
    res = await client.get("/api/v1/ctfd/status")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["ctfd_url"] == settings.CTFD_URL
    assert data["available_challenges"] >= 3

    # 2. Challenges endpoint
    res = await client.get("/api/v1/ctfd/challenges")
    assert res.status_code == 200
    challenges = res.json()
    assert isinstance(challenges, list)
    assert len(challenges) >= 3
    ids = [c["id"] for c in challenges]
    assert "ctf-linux-perms-01" in ids
    assert "ctf-web-sqli-01" in ids


WEBHOOK_SECRET = "test-ctfd-webhook-secret-123"


@pytest.fixture
def ctfd_secret(monkeypatch: pytest.MonkeyPatch) -> str:
    monkeypatch.setattr(settings, "CTFD_WEBHOOK_SECRET", WEBHOOK_SECRET)
    return WEBHOOK_SECRET


@pytest.mark.asyncio
async def test_ctfd_webhook_solve_and_idempotency(client: AsyncClient, ctfd_secret: str) -> None:
    await register_user(client, email="pilot@cyberlearn.ke")
    solve_payload: dict[str, Any] = {
        "challengeId": "ctf-linux-perms-01",
        "challengeName": "Broken Vault: File Permissions",
        "userId": "learner-test-42",
        "userName": "RebuilderPilot",
        "userEmail": "Pilot@cyberlearn.ke",
        "points": 50,
        "flag": "FLAG{chmod_700_saved_the_grid}",
        "submissionType": "correct",
        "ltiLineitemUrl": "https://lms.openedx.org/courses/course-v1:REBUILD+000/lineitems/1",
        "ltiUserId": "openedx-user-42",
    }

    # First submission
    res = await client.post(
        "/api/v1/ctfd/webhook",
        json=solve_payload,
        headers={"X-CTFd-Secret": ctfd_secret},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "recorded"
    assert data["xp_awarded"] == 50
    assert data["badge_awarded"] is True
    assert data["lti_passback"] == "queued"
    assert data["new_total_xp"] == 50

    # Second submission of same challenge (idempotent: should NOT award double XP)
    res_repeat = await client.post(
        "/api/v1/ctfd/webhook",
        json=solve_payload,
        headers={"X-CTFd-Secret": ctfd_secret},
    )
    assert res_repeat.status_code == 200
    repeat_data = res_repeat.json()
    assert repeat_data["status"] == "recorded"
    assert repeat_data["xp_awarded"] == 0
    assert repeat_data["badge_awarded"] is False
    assert repeat_data["new_total_xp"] == 50


@pytest.mark.asyncio
async def test_ctfd_webhook_rejects_bad_or_missing_secret(client: AsyncClient, ctfd_secret: str) -> None:
    payload = {"challengeId": "ctf-linux-perms-01", "userEmail": "x@example.com", "points": 50}
    assert (await client.post("/api/v1/ctfd/webhook", json=payload)).status_code == 403
    res = await client.post("/api/v1/ctfd/webhook", json=payload, headers={"X-CTFd-Secret": "wrong"})
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_ctfd_webhook_disabled_without_secret(client: AsyncClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "CTFD_WEBHOOK_SECRET", "")
    payload = {"challengeId": "ctf-linux-perms-01", "points": 50}
    res = await client.post("/api/v1/ctfd/webhook", json=payload, headers={"X-CTFd-Secret": ""})
    assert res.status_code == 503


@pytest.mark.asyncio
async def test_ctfd_webhook_does_not_match_by_display_name(client: AsyncClient, ctfd_secret: str) -> None:
    await register_user(client, email="amina@example.com")  # display name "Amina"
    payload = {"challengeId": "ctf-linux-perms-01", "userName": "Amina", "points": 50}
    res = await client.post("/api/v1/ctfd/webhook", json=payload, headers={"X-CTFd-Secret": ctfd_secret})
    assert res.json() == {"status": "ignored", "reason": "missing_user_email"}


@pytest.mark.asyncio
async def test_ctfd_webhook_ignores_incorrect_submission(client: AsyncClient, ctfd_secret: str) -> None:
    payload = {
        "challengeId": "ctf-linux-perms-01",
        "submissionType": "incorrect",
        "points": 50,
    }
    res = await client.post("/api/v1/ctfd/webhook", json=payload, headers={"X-CTFd-Secret": ctfd_secret})
    assert res.status_code == 200
    assert res.json() == {"status": "ignored", "reason": "not_correct_submission"}


@pytest.mark.asyncio
async def test_ctfd_direct_solve_requires_login(client: AsyncClient) -> None:
    payload = {"challengeId": "ctf-linux-perms-01", "flag": "flag{scada_file_perms_restored_2031}"}
    res = await client.post("/api/v1/ctfd/solve", json=payload)
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_ctfd_direct_solve_checks_flag(client: AsyncClient) -> None:
    await register_user(client)
    wrong = await client.post(
        "/api/v1/ctfd/solve", json={"challengeId": "ctf-linux-perms-01", "flag": "flag{nope}"}
    )
    assert wrong.status_code == 200
    assert wrong.json()["status"] == "incorrect"

    right = {"challengeId": "ctf-linux-perms-01", "flag": "flag{scada_file_perms_restored_2031}"}
    res = await client.post("/api/v1/ctfd/solve", json=right)
    data = res.json()
    assert data["status"] == "correct"
    assert data["points"] == 50  # server-side points, not client-chosen

    again = await client.post("/api/v1/ctfd/solve", json=right)
    assert again.json()["status"] == "already_solved"
    assert again.json()["points"] == 0

    unknown = await client.post("/api/v1/ctfd/solve", json={"challengeId": "nope", "flag": "x"})
    assert unknown.status_code == 404


@pytest.mark.asyncio
async def test_lti_jwks_and_platform_registration(client: AsyncClient, lti_on: None) -> None:
    # 1. JWKS
    jwks_res = await client.get("/.well-known/jwks.json")
    assert jwks_res.status_code == 200
    jwks_body = jwks_res.json()
    assert "keys" in jwks_body
    assert len(jwks_body["keys"]) > 0
    assert jwks_body["keys"][0]["kid"] == "empower-lti-key-1"

    # 2. Register Platform
    reg_payload = {
        "platformName": "Open edX Tutor Local",
        "clientId": "test-openedx-client",
        "platformOidcAuthUrl": "http://openedx.local/oauth2/authorize",
        "platformJwksUrl": "http://openedx.local/oauth2/jwks",
        "deploymentId": "1",
    }
    reg_res = await client.post("/api/v1/lti/register", json=reg_payload)
    assert reg_res.status_code == 200
    assert reg_res.json()["clientId"] == "test-openedx-client"

    # 3. List platforms
    list_res = await client.get("/api/v1/lti/platforms")
    assert list_res.status_code == 200
    platforms = list_res.json()
    assert any(p["clientId"] == "test-openedx-client" for p in platforms)


@pytest.mark.asyncio
async def test_lti_oidc_login_redirect(client: AsyncClient, lti_on: None) -> None:
    # Ensure platform is registered
    await client.post(
        "/api/v1/lti/register",
        json={
            "platformName": "Canvas Test",
            "clientId": "canvas-client-123",
            "platformOidcAuthUrl": "https://canvas.example.edu/api/lti/authorize",
            "platformJwksUrl": "https://canvas.example.edu/api/lti/security/jwks",
            "deploymentId": "dep-1",
        },
    )

    # Initiate login
    login_res = await client.get(
        "/lti/login",
        params={
            "client_id": "canvas-client-123",
            "login_hint": "user_101",
            "lti_message_hint": "msg_xyz",
            "target_link_uri": "http://test/lti/launch",
        },
        follow_redirects=False,
    )
    assert login_res.status_code == 302
    loc = login_res.headers["location"]
    assert "https://canvas.example.edu/api/lti/authorize" in loc
    assert "client_id=canvas-client-123" in loc
    assert "response_type=id_token" in loc


@pytest.mark.asyncio
async def test_lti_launch_handler(client: AsyncClient, lti_on: None) -> None:
    # Construct simulated LTI 1.3 launch JWT token (header.payload.signature)
    payload_claim = {
        "iss": "http://openedx.local",
        "sub": "user-42",
        "aud": "openedx-tutor-client",
        "https://purl.imsglobal.org/spec/lti/claim/context": {
            "id": "course-v1:REBUILD+000+2031",
        },
        "https://purl.imsglobal.org/spec/lti/claim/custom": {
            "lesson_id": "rebuild-000-1-1",
        },
    }
    encoded_payload = (
        base64.urlsafe_b64encode(json.dumps(payload_claim).encode())
        .decode()
        .rstrip("=")
    )
    fake_jwt = f"eyJhbGciOiJSUzI1NiJ9.{encoded_payload}.signature_placeholder"

    launch_res = await client.post("/lti/launch", data={"id_token": fake_jwt})
    assert launch_res.status_code == 200
    assert "/learn/lesson/rebuild-000-1-1" in launch_res.text


@pytest.mark.asyncio
async def test_lti_deep_linking_catalogue(client: AsyncClient, lti_on: None) -> None:
    res = await client.get("/lti/deep-link/items")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["count"] >= 3
    titles = [item["title"] for item in data["content_items"]]
    assert any("The Rebuild Protocol" in t for t in titles)
    assert any("CTF Lab" in t for t in titles)

    # Post route also supported
    res_post = await client.post("/lti/deep-link")
    assert res_post.status_code == 200


@pytest.mark.asyncio
async def test_lti_grade_passback_ags(client: AsyncClient, lti_on: None) -> None:
    grade_req = {
        "learner_id": "learner-100",
        "lesson_id": "rebuild-000-1-1",
        "score_given": 85.0,
        "score_maximum": 100.0,
        "lineitem_url": "https://lms.openedx.org/courses/test/lineitems/1",
    }
    res = await client.post("/lti/grade-passback", json=grade_req)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "queued"
    assert data["normalized_score"] == 0.85
    assert data["ags_payload"]["scoreGiven"] == 85.0
    assert data["ags_payload"]["scoreMaximum"] == 100.0
    assert data["ags_payload"]["activityProgress"] == "Completed"
    assert data["ags_payload"]["gradingProgress"] == "FullyGraded"


@pytest.mark.asyncio
async def test_lti_is_off_by_default(client: AsyncClient) -> None:
    assert (await client.get("/.well-known/jwks.json")).status_code == 404
    assert (await client.post("/lti/launch", data={"id_token": "a.b.c"})).status_code == 404


@pytest.mark.asyncio
async def test_lti_registration_requires_staff(client: AsyncClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "LTI_ENABLED", True)
    res = await client.post(
        "/api/v1/lti/register",
        json={
            "platformName": "Rogue",
            "clientId": "rogue",
            "platformOidcAuthUrl": "https://evil.example/authorize",
            "platformJwksUrl": "https://evil.example/jwks",
            "deploymentId": "1",
        },
    )
    assert res.status_code == 404
    assert (await client.get("/api/v1/lti/platforms")).status_code == 404


@pytest.mark.asyncio
async def test_lti_launch_does_not_reflect_markup(client: AsyncClient, lti_on: None) -> None:
    claims = {"https://purl.imsglobal.org/spec/lti/claim/custom": {"lesson_id": '"><script>alert(1)</script>'}}
    body = base64.urlsafe_b64encode(json.dumps(claims).encode()).decode().rstrip("=")
    res = await client.post("/lti/launch", data={"id_token": f"x.{body}.y"})
    assert res.status_code == 200
    assert "<script>" not in res.text
    assert "/learn/skill-tree" in res.text  # unsafe id dropped


def test_lti_refused_in_production(monkeypatch: pytest.MonkeyPatch) -> None:
    from app.security import assert_secure_settings

    monkeypatch.setattr(settings, "ENVIRONMENT", "production")
    monkeypatch.setattr(settings, "SECRET_KEY", "x" * 40)
    monkeypatch.setattr(settings, "DATABASE_URL", "postgresql+asyncpg://u:strongpass@db/app")
    monkeypatch.setattr(settings, "ADMIN_STAFF_KEY", "a-long-staff-key-123")
    monkeypatch.setattr(settings, "CORS_ORIGINS", ["https://app.example"])
    monkeypatch.setattr(settings, "REDIS_URL", "off")
    monkeypatch.setattr(settings, "LTI_ENABLED", True)
    with pytest.raises(RuntimeError, match="LTI_ENABLED"):
        assert_secure_settings()
