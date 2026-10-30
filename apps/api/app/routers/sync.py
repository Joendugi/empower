"""Batch sync for the offline queue.

A phone that was offline replays everything it queued in one request instead of one
request per answer, which kept tripping the per-minute write limit after a long offline
stretch. Each event carries the id the device gave it, which doubles as the idempotency
key, so a batch that is retried after a dropped connection is applied once.

Every event gets its own result. An event the server can't apply (the exercise was
removed, say) comes back "rejected" so the device can drop it, instead of blocking
everything queued after it.
"""

from __future__ import annotations

import logging
from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache import CacheBackend
from app.database import get_db
from app.deps import get_current_learner, get_redis
from app.models.learner import Learner
from app.models.streak import Streak
from app.models.submission import LessonCompletion, Submission
from app.routers.submissions import SubmissionCreate, complete_lesson, create_submission
from app.schemas import CamelModel

logger = logging.getLogger(__name__)
router = APIRouter()

MAX_EVENTS = 200


class SyncEvent(CamelModel):
    id: str = Field(min_length=8, max_length=100)  # stored as the idempotency key (String(100))
    type: Literal["submission", "lesson_complete"]
    payload: dict[str, Any]


class SyncRequest(CamelModel):
    device_id: str | None = Field(default=None, max_length=120)
    events: list[SyncEvent] = Field(default_factory=list, max_length=MAX_EVENTS)


class SyncResult(CamelModel):
    id: str
    status: Literal["applied", "duplicate", "rejected"]
    is_correct: bool | None = None
    xp_awarded: int = 0
    detail: str | None = None


class SyncState(CamelModel):
    total_xp: int
    level: int
    completed_lesson_ids: list[str]
    current_streak: int
    longest_streak: int
    freeze_tokens: int


class SyncResponse(CamelModel):
    results: list[SyncResult]
    state: SyncState


async def _applied_by(db: AsyncSession, event: SyncEvent) -> str | None:
    """Learner id that already used this event id, if any."""
    model = Submission if event.type == "submission" else LessonCompletion
    return await db.scalar(select(model.learner_id).where(model.idempotency_key == event.id))


async def _apply(
    db: AsyncSession, cache: CacheBackend, learner: Learner, event: SyncEvent
) -> SyncResult:
    owner = await _applied_by(db, event)
    if owner == learner.id:
        return SyncResult(id=event.id, status="duplicate")
    if owner is not None:
        return SyncResult(id=event.id, status="rejected", detail="Event id already used")
    if event.type == "submission":
        payload = SubmissionCreate.model_validate(event.payload)
        graded = await create_submission(
            payload=payload, x_idempotency_key=event.id, learner=learner, db=db, redis=cache
        )
        return SyncResult(
            id=event.id, status="applied", is_correct=graded.is_correct, xp_awarded=graded.xp_awarded
        )
    lesson_id = str(event.payload.get("lessonId") or "")
    done = await complete_lesson(lesson_id=lesson_id, x_idempotency_key=event.id, learner=learner, db=db, redis=cache)
    return SyncResult(id=event.id, status="applied", xp_awarded=done.xp_awarded)


async def _state(db: AsyncSession, learner: Learner) -> SyncState:
    completed = await db.scalars(
        select(LessonCompletion.lesson_id).where(LessonCompletion.learner_id == learner.id).distinct()
    )
    streak = await db.scalar(select(Streak).where(Streak.learner_id == learner.id))
    return SyncState(
        total_xp=learner.total_xp,
        level=learner.level,
        completed_lesson_ids=sorted(completed.all()),
        current_streak=streak.current_streak if streak else 0,
        longest_streak=streak.longest_streak if streak else 0,
        freeze_tokens=streak.freeze_tokens_remaining if streak else 0,
    )


@router.post("/sync", response_model=SyncResponse)
async def sync(
    payload: SyncRequest,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
    cache: CacheBackend = Depends(get_redis),
) -> SyncResponse:
    """Apply queued offline events in order and return the learner's authoritative progress."""
    results: list[SyncResult] = []
    for event in payload.events:
        try:
            # A savepoint per event: one that fails leaves no half-written rows behind.
            async with db.begin_nested():
                results.append(await _apply(db, cache, learner, event))
        except HTTPException as exc:
            results.append(SyncResult(id=event.id, status="rejected", detail=str(exc.detail)))
        except ValueError as exc:  # payload failed validation
            results.append(SyncResult(id=event.id, status="rejected", detail=str(exc)[:200]))
    await db.commit()
    await db.refresh(learner)
    return SyncResponse(results=results, state=await _state(db, learner))
