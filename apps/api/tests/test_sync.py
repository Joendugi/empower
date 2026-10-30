"""POST /sync: one round trip for everything a phone queued offline."""

from __future__ import annotations

from typing import Any

from httpx import AsyncClient

from app.services.content import get_raw_exercise
from tests.conftest import register_user

LESSON = "metallurgy-foundry-day-2"


def _batch() -> list[dict[str, Any]]:
    mc = get_raw_exercise(LESSON, "met-d2-q1")
    assert mc
    wrong = next(o["id"] for o in mc["options"] if o["id"] != mc["correct_answer"])
    return [
        {"id": "dev1-0001-right", "type": "submission",
         "payload": {"lessonId": LESSON, "exerciseId": "met-d2-q1", "answer": mc["correct_answer"]}},
        {"id": "dev1-0002-wrong", "type": "submission",
         "payload": {"lessonId": LESSON, "exerciseId": "met-d2-q1", "answer": wrong}},
        {"id": "dev1-0003-gone", "type": "submission",
         "payload": {"lessonId": LESSON, "exerciseId": "removed-exercise", "answer": "a"}},
        {"id": "dev1-0004-bad", "type": "submission", "payload": {"lessonId": LESSON}},
        {"id": "dev1-0005-done", "type": "lesson_complete", "payload": {"lessonId": LESSON}},
    ]


async def test_sync_applies_each_event_and_returns_progress(client: AsyncClient) -> None:
    await register_user(client)
    res = await client.post("/api/v1/sync", json={"deviceId": "phone-1", "events": _batch()})
    assert res.status_code == 200, res.text
    body = res.json()
    by_id = {r["id"]: r for r in body["results"]}

    assert by_id["dev1-0001-right"]["status"] == "applied" and by_id["dev1-0001-right"]["isCorrect"] is True
    assert by_id["dev1-0002-wrong"]["status"] == "applied" and by_id["dev1-0002-wrong"]["isCorrect"] is False
    # Events the server can't apply are rejected individually, not left blocking the queue.
    assert by_id["dev1-0003-gone"]["status"] == "rejected"
    assert by_id["dev1-0004-bad"]["status"] == "rejected"
    assert by_id["dev1-0005-done"]["status"] == "applied"

    earned = by_id["dev1-0001-right"]["xpAwarded"] + by_id["dev1-0005-done"]["xpAwarded"]
    assert earned > 0
    assert body["state"]["totalXp"] == earned
    assert body["state"]["completedLessonIds"] == [LESSON]
    assert body["state"]["currentStreak"] >= 1


async def test_retrying_a_batch_applies_it_once(client: AsyncClient) -> None:
    await register_user(client)
    first = (await client.post("/api/v1/sync", json={"events": _batch()})).json()
    again = (await client.post("/api/v1/sync", json={"events": _batch()})).json()
    statuses = {r["id"]: r["status"] for r in again["results"]}
    assert statuses["dev1-0001-right"] == "duplicate"
    assert statuses["dev1-0005-done"] == "duplicate"
    assert again["state"]["totalXp"] == first["state"]["totalXp"]


async def test_event_ids_from_another_learner_are_refused(client: AsyncClient) -> None:
    await register_user(client)
    await client.post("/api/v1/sync", json={"events": _batch()[:1]})
    await register_user(client, email="second@example.com")
    res = (await client.post("/api/v1/sync", json={"events": _batch()[:1]})).json()
    assert res["results"][0]["status"] == "rejected"
    assert res["state"]["totalXp"] == 0


async def test_batch_size_is_capped(client: AsyncClient) -> None:
    await register_user(client)
    events = [
        {"id": f"dev1-{i:06d}", "type": "lesson_complete", "payload": {"lessonId": LESSON}} for i in range(201)
    ]
    assert (await client.post("/api/v1/sync", json={"events": events})).status_code == 422


async def test_sync_requires_sign_in(client: AsyncClient) -> None:
    assert (await client.post("/api/v1/sync", json={"events": []})).status_code == 401
