from __future__ import annotations

from httpx import AsyncClient

from tests.conftest import register_user


async def test_published_lesson_is_regraded_on_the_server(client: AsyncClient) -> None:
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
