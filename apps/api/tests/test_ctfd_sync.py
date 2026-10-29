import pytest

from app.services.ctfd_sync import fetch_ctfd_challenges_remote, map_challenge_to_lesson
from app.workers.celery_app import sync_ctfd_challenges_task


@pytest.mark.asyncio
async def test_fetch_ctfd_challenges_fallback() -> None:
    challenges = await fetch_ctfd_challenges_remote()
    assert len(challenges) >= 3
    ids = [c["id"] for c in challenges]
    assert "ctf-linux-perms-01" in ids
    assert "ctf-web-sqli-01" in ids


def test_map_challenge_to_lesson() -> None:
    assert map_challenge_to_lesson("ctf-linux-perms-01") == "linux-essentials-lesson-1"
    assert map_challenge_to_lesson("ctf-web-sqli-01") == "web-security-lesson-1"
    assert map_challenge_to_lesson("non-existent") is None


def test_sync_ctfd_challenges_celery_task() -> None:
    res = sync_ctfd_challenges_task()
    assert res["status"] == "synced"
    assert res["count"] >= 3
