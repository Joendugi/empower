from __future__ import annotations

import pytest
from httpx import AsyncClient

from app.config import settings
from tests.conftest import register_user

STAFF_KEY = "test-office-staff-key-1234"


async def test_published_lesson_is_regraded_on_the_server(client: AsyncClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "ADMIN_STAFF_KEY", STAFF_KEY)
    await register_user(client)
    publish = await client.put(
        "/api/v1/studio/sync",
        json={
            "drafts": [],
            "published": [
                {
                    "path": {
                        "id": "path-engine",
                        "title": "Engine week",
                        "description": "Shop",
                        "nodes": [{"id": "n1", "title": "Week 1", "lessonIds": ["week-1"], "prerequisites": []}],
                    },
                    "lessons": [
                        {
                            "id": "week-1",
                            "title": "Week 1",
                            "exercises": [
                                {
                                    "id": "q1",
                                    "type": "MULTIPLE_CHOICE",
                                    "prompt": "Torque unit?",
                                    "correctAnswer": "a",
                                    "options": [{"id": "a", "text": "Nm"}, {"id": "b", "text": "W"}],
                                    "xpReward": 50,
                                }
                            ],
                        }
                    ],
                }
            ],
        },
        headers={"X-Staff-Key": STAFF_KEY},
    )
    assert publish.status_code == 200
    public = publish.json()["published"][0]["lessons"][0]
    assert "correctAnswer" not in public["exercises"][0]
    assert public["exercises"][0]["answerHashes"]

    lesson = await client.get("/api/v1/lessons/week-1")
    assert lesson.status_code == 200
    assert "correctAnswer" not in lesson.json()["exercises"][0]

    wrong = await client.post(
        "/api/v1/submissions",
        json={"lessonId": "week-1", "exerciseId": "q1", "answer": "b"},
    )
    assert wrong.status_code == 201
    assert wrong.json()["isCorrect"] is False
    assert wrong.json()["xpAwarded"] == 0

    right = await client.post(
        "/api/v1/submissions",
        json={"lessonId": "week-1", "exerciseId": "q1", "answer": "a"},
    )
    assert right.status_code == 201
    assert right.json()["isCorrect"] is True
    assert right.json()["xpAwarded"] == 50


async def test_production_hides_docs(monkeypatch) -> None:
    from app.config import Settings
    from app.main import create_app
    from tests.conftest import FakeRedis

    monkeypatch.setenv("ENVIRONMENT", "production")
    settings = Settings(
        ENVIRONMENT="production",
        SECRET_KEY="production-secret-key-32-chars-min-ok",
        DATABASE_URL="sqlite+aiosqlite:///:memory:",
        ADMIN_STAFF_KEY="long-office-key-ok",
        CORS_ORIGINS=["https://empower.local"],
        REDIS_URL="off",
    )
    monkeypatch.setattr("app.main.settings", settings)
    monkeypatch.setattr("app.security.settings", settings)
    app = create_app(redis=FakeRedis())
    assert app.docs_url is None
    assert app.redoc_url is None
    assert app.openapi_url is None


def _publish_body(path_id: str, lesson_id: str, xp: int = 50, answer: str = "a") -> dict:
    return {
        "drafts": [{"id": f"draft-{lesson_id}", "title": "My draft"}],
        "published": [
            {
                "path": {"id": path_id, "title": "Course", "nodes": [{"id": "n1", "title": "W1", "lessonIds": [lesson_id]}]},
                "lessons": [
                    {
                        "id": lesson_id,
                        "title": "Lesson",
                        "exercises": [
                            {
                                "id": "q1",
                                "type": "MULTIPLE_CHOICE",
                                "prompt": "Pick",
                                "correctAnswer": answer,
                                "options": [{"id": "a", "text": "A"}, {"id": "b", "text": "B"}],
                                "xpReward": xp,
                            }
                        ],
                    }
                ],
            }
        ],
    }


async def test_learner_cannot_publish_but_drafts_still_sync(client: AsyncClient) -> None:
    await register_user(client, email="plain-publisher@example.com")
    res = await client.put("/api/v1/studio/sync", json=_publish_body("learner-course", "learner-lesson"))
    assert res.status_code == 200
    assert res.json()["published"] == []
    assert [d["id"] for d in res.json()["drafts"]] == ["draft-learner-lesson"]
    assert (await client.get("/api/v1/lessons/learner-lesson")).status_code == 404


async def test_publishing_rules_for_educators(client: AsyncClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(settings, "ADMIN_STAFF_KEY", STAFF_KEY)
    staff = {"X-Staff-Key": STAFF_KEY}

    # Built-in programme and lesson ids can't be shadowed.
    await register_user(client, email="educator-a@example.com")
    res = await client.put(
        "/api/v1/studio/sync", json=_publish_body("automotive", "automotive-safety-lesson"), headers=staff
    )
    assert res.json()["published"] == []

    # XP per question is capped like YAML content.
    res = await client.put("/api/v1/studio/sync", json=_publish_body("ed-course", "ed-lesson", xp=10**9), headers=staff)
    assert res.json()["published"][0]["lessons"][0]["exercises"][0]["xpReward"] == 200
    submit = await client.post("/api/v1/submissions", json={"lessonId": "ed-lesson", "exerciseId": "q1", "answer": "a"})
    assert submit.json()["xpAwarded"] == 200


async def test_educator_cannot_overwrite_another_educators_course(client: AsyncClient, monkeypatch: pytest.MonkeyPatch) -> None:
    from sqlalchemy import update

    from app.database import AsyncSessionLocal
    from app.models.learner import Learner

    owner = await register_user(client, email="owner-ed@example.com")
    other = await register_user(client, email="other-ed@example.com")
    async with AsyncSessionLocal() as db:
        await db.execute(
            update(Learner)
            .where(Learner.id.in_([owner["learner"]["id"], other["learner"]["id"]]))
            .values(role="educator")
        )
        await db.commit()

    client.headers["Authorization"] = f"Bearer {owner['accessToken']}"
    first = await client.put("/api/v1/studio/sync", json=_publish_body("shared-course", "shared-lesson", answer="a"))
    assert first.json()["published"]

    client.headers["Authorization"] = f"Bearer {other['accessToken']}"
    await client.put("/api/v1/studio/sync", json=_publish_body("shared-course", "shared-lesson", answer="b"))
    graded = await client.post("/api/v1/submissions", json={"lessonId": "shared-lesson", "exerciseId": "q1", "answer": "a"})
    assert graded.json()["isCorrect"] is True  # the original answer key still stands
