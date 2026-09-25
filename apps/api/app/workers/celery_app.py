"""
Celery application and scheduled tasks for CyberLearn Gamification Service.

Tasks:
- generate_review_sessions: nightly pre-computation of due FSRS cards per learner,
  cached in Redis so the GET /review/{id}/session endpoint is fast.
- reset_monthly_freeze_tokens: monthly reset of streak freeze tokens.
"""

from __future__ import annotations

from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_app = Celery(
    "cyberlearn",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Africa/Nairobi",  # EAT
    enable_utc=True,
    beat_schedule={
        # Nightly at 02:00 EAT — pre-generate review sessions for all learners
        "generate-review-sessions-nightly": {
            "task": "app.workers.celery_app.generate_review_sessions",
            "schedule": crontab(hour=2, minute=0),
        },
        # 1st of each month at 00:01 EAT — reset streak freeze tokens
        "reset-freeze-tokens-monthly": {
            "task": "app.workers.celery_app.reset_monthly_freeze_tokens",
            "schedule": crontab(hour=0, minute=1, day_of_month=1),
        },
    },
)


@celery_app.task(name="app.workers.celery_app.generate_review_sessions")  # type: ignore[misc]
def generate_review_sessions() -> dict[str, int]:
    """
    Pre-compute FSRS review sessions for all learners with due cards.
    Caches each session in Redis as JSON (TTL: 24h).

    This is a synchronous Celery task — uses a separate sync DB session.
    """
    import asyncio
    from datetime import date

    from sqlalchemy import select, text

    # We run a quick async event loop just for the DB query
    async def _run() -> int:
        import json

        import redis.asyncio as aioredis

        from app.database import AsyncSessionLocal

        redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        count = 0

        async with AsyncSessionLocal() as db:
            # Get all distinct learner IDs with due cards
            result = await db.execute(
                text("SELECT DISTINCT learner_id FROM fsrs_cards WHERE due_date <= :today"),
                {"today": date.today().isoformat()},
            )
            learner_ids = [row[0] for row in result.fetchall()]

            for learner_id in learner_ids:
                from app.models.fsrs_card import FSRSCard

                cards_result = await db.execute(
                    select(FSRSCard)
                    .where(FSRSCard.learner_id == learner_id, FSRSCard.due_date <= date.today())
                    .order_by(FSRSCard.due_date)
                    .limit(15)
                )
                cards = cards_result.scalars().all()

                session_data = {
                    "learner_id": learner_id,
                    "cards": [
                        {"content_id": c.content_id, "due_date": c.due_date.isoformat(), "reps": c.reps}
                        for c in cards
                    ],
                    "generated_at": date.today().isoformat(),
                }

                await redis.setex(
                    f"review:{learner_id}:today",
                    86400,  # 24h TTL
                    json.dumps(session_data),
                )
                count += 1

        await redis.aclose()
        return count

    processed = asyncio.run(_run())
    return {"learners_processed": processed}


@celery_app.task(name="app.workers.celery_app.reset_monthly_freeze_tokens")  # type: ignore[misc]
def reset_monthly_freeze_tokens() -> dict[str, int]:
    """Reset freeze tokens to 2 for all learners at the start of each month."""
    import asyncio

    from sqlalchemy import update

    async def _run() -> int:
        from datetime import date

        from app.database import AsyncSessionLocal
        from app.models.streak import Streak

        async with AsyncSessionLocal() as db:
            result = await db.execute(
                update(Streak)
                .values(freeze_tokens_remaining=2, freeze_tokens_last_reset=date.today())
                .returning(Streak.learner_id)
            )
            await db.commit()
            return len(result.fetchall())

    count = asyncio.run(_run())
    return {"streaks_reset": count}
