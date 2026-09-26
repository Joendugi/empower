from __future__ import annotations

from httpx import AsyncClient

from tests.conftest import register_user


async def test_discussion_posts_flow(client: AsyncClient) -> None:
    await register_user(client)
    # List initial posts
    res = await client.get("/api/v1/lessons/osi-model-intro/posts")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    # Create top-level question
    created = await client.post(
        "/api/v1/lessons/osi-model-intro/posts",
        json={"body": "How does Layer 3 routing work?"},
    )
    assert created.status_code == 201
    post_data = created.json()
    assert post_data["body"] == "How does Layer 3 routing work?"
    assert post_data["parentId"] is None
    post_id = post_data["id"]

    # Reply to post
    reply = await client.post(
        "/api/v1/lessons/osi-model-intro/posts",
        json={"body": "It routes based on IP destination addresses.", "parentId": post_id},
    )
    assert reply.status_code == 201
    assert reply.json()["parentId"] == post_id

    # Upvote post
    upvote = await client.post(f"/api/v1/posts/{post_id}/upvote")
    assert upvote.status_code == 200
    assert upvote.json()["upvotes"] >= 1


async def test_rubric_and_signoff_flow(client: AsyncClient) -> None:
    await register_user(client)
    # Create a rubric
    res = await client.post(
        "/api/v1/rubrics",
        json={
            "lessonId": "osi-model-intro",
            "title": "Network Patching Practical Exam",
            "criteria": [
                {"id": "crit-1", "label": "T568B pinout matched", "description": "Check wire ordering", "required": True},
                {"id": "crit-2", "label": "Tester confirms continuity", "description": "8 pins lit green", "required": True},
            ],
        },
    )
    assert res.status_code == 201
    rubric = res.json()
    rubric_id = rubric["id"]
    assert len(rubric["criteria"]) == 2

    # Sign off with only 1 required criterion (should not pass)
    partial_signoff = await client.post(
        f"/api/v1/rubrics/{rubric_id}/signoff",
        json={
            "learnerId": "student-123",
            "evidenceNote": "Only crimped one end so far",
            "criteriaMet": ["crit-1"],
        },
    )
    assert partial_signoff.status_code == 201
    assert partial_signoff.json()["passed"] is False

    # Sign off with both required criteria (should pass)
    full_signoff = await client.post(
        f"/api/v1/rubrics/{rubric_id}/signoff",
        json={
            "learnerId": "student-123",
            "evidenceNote": "All 8 pins validated with cable tester",
            "criteriaMet": ["crit-1", "crit-2"],
        },
    )
    assert full_signoff.status_code == 201
    assert full_signoff.json()["passed"] is True


async def test_lti_endpoints(client: AsyncClient) -> None:
    # JWKS public key endpoint
    jwks_res = await client.get("/.well-known/jwks.json")
    assert jwks_res.status_code == 200
    jwks_data = jwks_res.json()
    assert "keys" in jwks_data
    assert len(jwks_data["keys"]) > 0
    assert jwks_data["keys"][0]["alg"] == "RS256"

    # Platform registration
    reg_res = await client.post(
        "/api/v1/lti/register",
        json={
            "platformName": "Canvas TVET Portal",
            "clientId": "canvas-client-999",
            "platformOidcAuthUrl": "https://canvas.example.edu/api/lti/authorize_redirect",
            "platformJwksUrl": "https://canvas.example.edu/api/lti/security/jwks",
            "deploymentId": "dep-1",
        },
    )
    assert reg_res.status_code == 200
    assert reg_res.json()["clientId"] == "canvas-client-999"

    # Grade passback queue endpoint
    grade_res = await client.post(
        "/lti/grade-passback",
        json={
            "learner_id": "test-learner",
            "lesson_id": "osi-model-intro",
            "score_given": 95.0,
            "score_maximum": 100.0,
        },
    )
    assert grade_res.status_code == 200
    assert grade_res.json()["status"] == "queued"
