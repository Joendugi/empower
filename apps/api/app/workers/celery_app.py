"""
Celery application and scheduled tasks for CyberLearn Gamification Service.

Tasks:
- generate_review_sessions: nightly pre-computation of due FSRS cards per learner,
  cached in Redis so the GET /review/{id}/session endpoint is fast.
- reset_monthly_freeze_tokens: monthly reset of streak freeze tokens.
"""

from __future__ import annotations

import ssl
from typing import Any

from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_app = Celery(
    "cyberlearn",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

if settings.REDIS_URL.startswith("rediss://"):
    # ElastiCache in-transit encryption; Celery refuses rediss:// without explicit TLS options.
    celery_app.conf.broker_use_ssl = {"ssl_cert_reqs": ssl.CERT_REQUIRED}
    celery_app.conf.redis_backend_use_ssl = {"ssl_cert_reqs": ssl.CERT_REQUIRED}

if settings.SENTRY_DSN:
    import sentry_sdk

    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        release=settings.APP_VERSION,
        traces_sample_rate=settings.SENTRY_TRACES_SAMPLE_RATE,
        send_default_pii=False,
    )

celery_app.conf.update(
    broker_connection_retry_on_startup=True,
    worker_prefetch_multiplier=1,  # AI grading tasks are slow; don't let one worker hoard them
    task_acks_late=True,
    task_reject_on_worker_lost=True,
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


@celery_app.task(name="app.workers.celery_app.evaluate_formative_feedback_task")  # type: ignore[misc]
def evaluate_formative_feedback_task(feedback_id: str) -> dict[str, Any]:
    """
    Background worker task to evaluate a learner's open-ended submission against rubric criteria.
    Updates FormativeFeedback row with score, criteria breakdown, summary, and completed_at.
    """
    import asyncio
    import json
    from datetime import UTC, datetime

    from sqlalchemy import select

    async def _run() -> dict[str, Any]:
        from app.database import AsyncSessionLocal
        from app.models.feedback import FormativeFeedback
        from app.services.llm_rubric import evaluate_submission_response

        async with AsyncSessionLocal() as db:
            fb = await db.scalar(select(FormativeFeedback).where(FormativeFeedback.id == feedback_id))
            if not fb:
                return {"status": "error", "message": f"Feedback ID {feedback_id} not found"}

            fb.status = "processing"
            await db.commit()

            criteria = json.loads(fb.criteria_json) if fb.criteria_json else None
            result = await evaluate_submission_response(fb.prompt, fb.learner_response, criteria)

            fb.overall_score = result.overall_score
            fb.passed = result.passed
            fb.criterion_evaluations = json.dumps([c.model_dump(by_alias=True) for c in result.criterion_evaluations])
            fb.summary = result.summary
            fb.strengths = json.dumps(result.strengths)
            fb.actionable_guidance = json.dumps(result.actionable_guidance)
            fb.status = "completed"
            fb.completed_at = datetime.now(UTC)
            await db.commit()

            return {
                "status": "completed",
                "feedback_id": feedback_id,
                "overall_score": result.overall_score,
                "passed": result.passed,
            }

    try:
        asyncio.get_running_loop()
        import concurrent.futures

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            return executor.submit(lambda: asyncio.run(_run())).result()
    except RuntimeError:
        return asyncio.run(_run())


@celery_app.task(name="app.workers.celery_app.sync_ctfd_challenges_task")  # type: ignore[misc]
def sync_ctfd_challenges_task() -> dict[str, Any]:
    """
    Periodically sync and cache available CTFd challenges.
    """
    import asyncio

    from app.services.ctfd_sync import fetch_ctfd_challenges_remote

    try:
        challenges = asyncio.run(fetch_ctfd_challenges_remote())
        return {"status": "synced", "count": len(challenges)}
    except Exception as exc:
        return {"status": "error", "message": str(exc)}



