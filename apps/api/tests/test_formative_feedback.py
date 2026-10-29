from __future__ import annotations

from typing import Any

import pytest
from httpx import AsyncClient

from app.services.llm_rubric import DEFAULT_CYBER_CRITERIA, heuristic_evaluate
from tests.conftest import register_user


@pytest.mark.asyncio
async def test_heuristic_evaluator_strong_and_weak_responses() -> None:
    # 1. Strong response covering threat, remediation, and infrastructure resilience
    strong_response = (
        "The attack vector was an unauthenticated BGP route hijacking combined with phishing for initial access. "
        "To mitigate and remediate this breach, we must enforce MFA across all administrative portals, deploy "
        "firewall segmentation between IT and SCADA systems, apply immediate security patches to the unpatched firmware, "
        "and implement RPKI route validation. For infrastructure resilience, we maintain isolated backup networks and "
        "failover power generators to prevent blackout cascading."
    )
    result = heuristic_evaluate(
        prompt="Explain how you would investigate and remediate the 2031 substation compromise.",
        learner_response=strong_response,
        criteria=DEFAULT_CYBER_CRITERIA,
    )
    assert result.overall_score >= 70.0
    assert result.passed is True
    assert len(result.criterion_evaluations) == 3
    assert len(result.strengths) > 0
    assert "Rebuilder Corps" in result.summary or "defensive response" in result.summary

    # 2. Weak response lacking depth and defensive measures
    weak_response = "I will reboot the computer."
    weak_result = heuristic_evaluate(
        prompt="Explain how you would investigate and remediate the 2031 substation compromise.",
        learner_response=weak_response,
        criteria=DEFAULT_CYBER_CRITERIA,
    )
    assert weak_result.overall_score < 50.0
    assert weak_result.passed is False
    assert len(weak_result.actionable_guidance) > 0


@pytest.mark.asyncio
async def test_formative_feedback_api_endpoints(client: AsyncClient) -> None:
    # Register and authenticate learner
    user = await register_user(client, email="rebuilder_eval@example.com")
    learner_id = user["learner"]["id"]

    eval_payload: dict[str, Any] = {
        "lessonId": "rebuild-000-2-1",
        "exerciseId": "rebuild-000-2-1-q3",
        "prompt": "How does multi-factor authentication prevent credential theft during a phishing incident?",
        "learnerResponse": (
            "Phishing lures attackers into capturing credentials. Multi-factor authentication (MFA) requires a second "
            "factor such as a hardware token or authenticator app. Even if the password is stolen, the attacker cannot "
            "authenticate without the second factor. We should enforce least privilege and firewall boundary policies."
        ),
        "asyncMode": False,
    }

    # 1. Post evaluation
    res = await client.post("/api/v1/rubrics/evaluate", json=eval_payload)
    assert res.status_code == 201
    feedback = res.json()
    assert feedback["status"] == "completed"
    assert feedback["learnerId"] == learner_id
    assert feedback["lessonId"] == "rebuild-000-2-1"
    assert feedback["overallScore"] >= 60.0
    assert feedback["passed"] is True
    assert len(feedback["criterionEvaluations"]) >= 2
    assert len(feedback["strengths"]) > 0

    feedback_id = feedback["id"]

    # 2. Retrieve feedback by ID
    get_res = await client.get(f"/api/v1/rubrics/feedback/{feedback_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == feedback_id

    # 3. List learner feedback
    list_res = await client.get(f"/api/v1/rubrics/learner/{learner_id}/feedback")
    assert list_res.status_code == 200
    history = list_res.json()
    assert len(history) >= 1
    assert any(h["id"] == feedback_id for h in history)


@pytest.mark.asyncio
async def test_celery_formative_feedback_worker_task(client: AsyncClient) -> None:
    from app.workers.celery_app import evaluate_formative_feedback_task

    await register_user(client, email="celery_worker_test@example.com")

    # Post with asyncMode=True
    eval_payload: dict[str, Any] = {
        "lessonId": "rebuild-000-3-1",
        "exerciseId": "r000-31-q4",
        "prompt": "Explain why password reuse across infrastructure accounts causes systemic failure.",
        "learnerResponse": "Attackers exploit credential stuffing to breach backup nodes and SCADA controllers.",
        "asyncMode": True,
    }
    res = await client.post("/api/v1/rubrics/evaluate", json=eval_payload)
    assert res.status_code == 201
    created = res.json()
    feedback_id = created["id"]

    # Execute worker task synchronously to simulate Celery runner
    task_res = evaluate_formative_feedback_task(feedback_id)
    assert task_res["status"] == "completed"
    assert task_res["feedback_id"] == feedback_id

    # Verify updated in DB
    verify_res = await client.get(f"/api/v1/rubrics/feedback/{feedback_id}")
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "completed"
    assert verify_res.json()["completedAt"] is not None


@pytest.mark.asyncio
async def test_formative_feedback_is_private_to_owner(client: AsyncClient) -> None:
    owner = await register_user(client, email="owner_eval@example.com")
    res = await client.post(
        "/api/v1/rubrics/evaluate",
        json={
            "lessonId": "rebuild-000-2-1",
            "exerciseId": "q1",
            "prompt": "Why MFA?",
            "learnerResponse": "MFA blocks stolen passwords.",
        },
    )
    feedback_id = res.json()["id"]

    await register_user(client, email="snoop_eval@example.com")
    assert (await client.get(f"/api/v1/rubrics/feedback/{feedback_id}")).status_code == 404
    other = await client.get(f"/api/v1/rubrics/learner/{owner['learner']['id']}/feedback")
    assert other.status_code == 403


@pytest.mark.asyncio
async def test_formative_feedback_respects_custom_max_score(client: AsyncClient) -> None:
    await register_user(client, email="maxscore_eval@example.com")
    res = await client.post(
        "/api/v1/rubrics/evaluate",
        json={
            "lessonId": "rebuild-000-2-1",
            "exerciseId": "q2",
            "prompt": "Why MFA?",
            "learnerResponse": "MFA blocks stolen passwords.",
            "criteria": [
                {"id": "c1", "label": "MFA", "description": "Explains MFA", "maxScore": 60},
            ],
        },
    )
    assert res.status_code == 201
    evaluations = res.json()["criterionEvaluations"]
    assert evaluations[0]["maxScore"] == 60
