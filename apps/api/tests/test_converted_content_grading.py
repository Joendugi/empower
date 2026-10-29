from __future__ import annotations

from typing import Any

import pytest
from httpx import AsyncClient

from app.services.content import get_raw_exercise
from tests.conftest import register_user


async def _submit(client: AsyncClient, lesson_id: str, exercise_id: str, answer: Any) -> dict[str, Any]:
    res = await client.post(
        "/api/v1/submissions", json={"lessonId": lesson_id, "exerciseId": exercise_id, "answer": answer}
    )
    assert res.status_code in (200, 201), res.text
    return res.json()


@pytest.mark.asyncio
async def test_day_unit_questions_are_gradeable(client: AsyncClient) -> None:
    """Regression: day-unit MC / match / multi-blank questions used formats nothing could grade."""
    await register_user(client)
    lesson = "metallurgy-foundry-day-2"

    mc = get_raw_exercise(lesson, "met-d2-q1")
    assert mc and mc["correct_answer"] in {o["id"] for o in mc["options"]}
    assert (await _submit(client, lesson, "met-d2-q1", mc["correct_answer"]))["isCorrect"] is True

    pairs = get_raw_exercise(lesson, "met-d2-q3")
    assert pairs
    answer = [f"{p['left']['id']}={p['right']['id']}" for p in reversed(pairs["pairs"])]  # any order
    assert (await _submit(client, lesson, "met-d2-q3", answer))["isCorrect"] is True

    blanks = get_raw_exercise("first-aid-trauma-day-4", "fa4-q2")
    assert blanks and blanks["correct_answer"] == ["above", "below"]
    assert (await _submit(client, "first-aid-trauma-day-4", "fa4-q2", ["Above", "below"]))["isCorrect"] is True
    assert (await _submit(client, "first-aid-trauma-day-4", "fa4-q2", ["below", "above"]))["isCorrect"] is False


@pytest.mark.asyncio
async def test_lesson_api_includes_detailed_notes(client: AsyncClient) -> None:
    await register_user(client)
    res = await client.get("/api/v1/lessons/metallurgy-foundry-day-2")
    assert res.status_code == 200, res.text
    body = res.json()
    assert "Forge Hearth" in body["contentMd"]
    assert body["outline"]
