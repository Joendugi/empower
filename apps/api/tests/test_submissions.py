from __future__ import annotations

from httpx import AsyncClient

from tests.conftest import register_user


async def test_lessons_omit_plaintext_answers(client: AsyncClient) -> None:
    await register_user(client)
    response = await client.get("/api/v1/lessons/osi-model-intro")
    assert response.status_code == 200
    body = response.json()
    assert body["contentVersion"]
    for exercise in body["exercises"]:
        assert "correctAnswer" not in exercise
        assert "correct_answer" not in exercise
        assert exercise["answerHashes"]


async def test_submission_grades_and_is_idempotent(client: AsyncClient) -> None:
    await register_user(client)
    first = await client.post(
        "/api/v1/submissions",
        headers={"X-Idempotency-Key": "sub-1"},
        json={"lessonId": "osi-model-intro", "exerciseId": "q1", "answer": "c"},
    )
    assert first.status_code == 201, first.text
    payload = first.json()
    assert payload["isCorrect"] is True
    assert payload["xpAwarded"] == 50
    assert payload["totalXp"] == 50

    replay = await client.post(
        "/api/v1/submissions",
        headers={"X-Idempotency-Key": "sub-1"},
        json={"lessonId": "osi-model-intro", "exerciseId": "q1", "answer": "c"},
    )
    assert replay.status_code == 201
    assert replay.json()["xpAwarded"] == 50
    assert replay.json()["totalXp"] == 50

    wrong = await client.post(
        "/api/v1/submissions",
        json={"lessonId": "osi-model-intro", "exerciseId": "q2", "answer": "udp"},
    )
    assert wrong.status_code == 201
    assert wrong.json()["isCorrect"] is False
    assert wrong.json()["xpAwarded"] == 0


async def test_camel_case_skill_paths(client: AsyncClient) -> None:
    await register_user(client)
    response = await client.get("/api/v1/skill-paths")
    assert response.status_code == 200
    paths = response.json()
    assert paths[0]["id"] == "cybersecurity"
    assert "lessonIds" in paths[0]["nodes"][0]


async def test_curriculum_requires_authentication(client: AsyncClient) -> None:
    for path in (
        "/api/v1/skill-paths",
        "/api/v1/skill-paths/cybersecurity",
        "/api/v1/lessons/osi-model-intro",
    ):
        response = await client.get(path)
        assert response.status_code == 401

    guest = await client.post("/api/v1/auth/guest", json={"displayName": "Guest"})
    client.headers["Authorization"] = f"Bearer {guest.json()['accessToken']}"
    assert (await client.get("/api/v1/skill-paths")).status_code == 403


async def test_cannot_post_raw_xp(client: AsyncClient) -> None:
    await register_user(client)
    response = await client.post("/api/v1/xp", json={"amount": 500, "source": "cheat"})
    assert response.status_code in {404, 405}
