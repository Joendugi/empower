from __future__ import annotations

import json
import math
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache import CacheBackend
from app.database import get_db
from app.deps import get_current_learner, get_redis
from app.models.fsrs_card import FSRSCard
from app.models.learner import Learner
from app.models.streak import Streak
from app.models.submission import LessonCompletion, Submission
from app.models.xp_event import XPEvent
from app.routers.xp import publish_leaderboard
from app.schemas import CamelModel
from app.services.badges import award_badge
from app.services.content import get_public_lesson, get_raw_exercise
from app.services.edx import edx_client
from app.services.grading import answers_match

router = APIRouter()

LESSON_COMPLETE_XP = 50


def xp_to_level(total_xp: int) -> int:
    return math.floor(math.sqrt(total_xp / 100)) + 1


class SubmissionCreate(CamelModel):
    lesson_id: str
    exercise_id: str
    answer: Any


class SubmissionRead(CamelModel):
    id: str
    lesson_id: str
    exercise_id: str
    is_correct: bool
    xp_awarded: int
    explanation: str | None = None
    total_xp: int
    level: int


class LessonCompleteRead(CamelModel):
    lesson_id: str
    xp_awarded: int
    accuracy: int
    total_xp: int
    level: int
    badges: list[str]
    edx: dict


async def _apply_xp(db: AsyncSession, learner: Learner, amount: int, source: str, content_id: str | None) -> None:
    learner.total_xp += amount
    learner.level = xp_to_level(learner.total_xp)
    db.add(
        XPEvent(
            learner_id=learner.id,
            amount=amount,
            source=source,
            content_id=content_id,
        )
    )


async def _touch_streak(db: AsyncSession, learner_id: str) -> Streak:
    today = date.today()
    streak = await db.get(Streak, learner_id)
    if not streak:
        streak = Streak(
            learner_id=learner_id,
            current_streak=1,
            longest_streak=1,
            last_activity_date=today,
            freeze_tokens_remaining=2,
        )
        db.add(streak)
        await db.flush()
        return streak
    if streak.last_activity_date == today:
        return streak
    from datetime import timedelta

    if streak.last_activity_date == today - timedelta(days=1):
        streak.current_streak += 1
    elif streak.last_activity_date == today - timedelta(days=2) and streak.freeze_tokens_remaining > 0:
        streak.freeze_tokens_remaining -= 1
        streak.current_streak += 1
    else:
        streak.current_streak = 1
    streak.longest_streak = max(streak.longest_streak, streak.current_streak)
    streak.last_activity_date = today
    return streak


async def _ensure_fsrs_card(db: AsyncSession, learner_id: str, content_id: str, correct: bool) -> None:
    card = await db.scalar(
        select(FSRSCard).where(FSRSCard.learner_id == learner_id, FSRSCard.content_id == content_id)
    )
    today = date.today()
    if card:
        return
    db.add(
        FSRSCard(
            learner_id=learner_id,
            content_id=content_id,
            stability=3.0 if correct else 0.5,
            difficulty=0.3 if correct else 0.5,
            due_date=today,
            last_review=today,
            reps=1,
            lapses=0 if correct else 1,
            state="Review" if correct else "Learning",
        )
    )


@router.post("/submissions", response_model=SubmissionRead, status_code=status.HTTP_201_CREATED)
async def create_submission(
    payload: SubmissionCreate,
    x_idempotency_key: str | None = Header(default=None, alias="X-Idempotency-Key"),
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
    redis: CacheBackend = Depends(get_redis),
) -> SubmissionRead:
    if x_idempotency_key:
        existing = await db.scalar(select(Submission).where(Submission.idempotency_key == x_idempotency_key))
        if existing:
            exercise = get_raw_exercise(existing.lesson_id, existing.exercise_id) or {}
            return SubmissionRead(
                id=existing.id,
                lesson_id=existing.lesson_id,
                exercise_id=existing.exercise_id,
                is_correct=existing.is_correct,
                xp_awarded=existing.xp_awarded,
                explanation=exercise.get("explanation"),
                total_xp=learner.total_xp,
                level=learner.level,
            )

    exercise = get_raw_exercise(payload.lesson_id, payload.exercise_id)
    if not exercise:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")

    expected = exercise.get("correct_answer")
    correct = answers_match(expected, payload.answer, str(exercise.get("type")))
    xp_reward = int(exercise.get("xp_reward") or exercise.get("xpReward") or 0)
    awarded = xp_reward if correct else 0

    already = await db.scalar(
        select(Submission).where(
            Submission.learner_id == learner.id,
            Submission.lesson_id == payload.lesson_id,
            Submission.exercise_id == payload.exercise_id,
            Submission.is_correct.is_(True),
        )
    )
    if already and correct:
        awarded = 0

    record = Submission(
        learner_id=learner.id,
        lesson_id=payload.lesson_id,
        exercise_id=payload.exercise_id,
        answer=json.dumps(payload.answer, ensure_ascii=False),
        is_correct=correct,
        xp_awarded=awarded,
        idempotency_key=x_idempotency_key,
    )
    db.add(record)

    if awarded:
        await _apply_xp(db, learner, awarded, "exercise_correct", payload.exercise_id)

    await _touch_streak(db, learner.id)
    await _ensure_fsrs_card(db, learner.id, payload.exercise_id, correct)
    await db.flush()
    await publish_leaderboard(redis, learner)

    return SubmissionRead(
        id=record.id,
        lesson_id=record.lesson_id,
        exercise_id=record.exercise_id,
        is_correct=correct,
        xp_awarded=awarded,
        explanation=exercise.get("explanation"),
        total_xp=learner.total_xp,
        level=learner.level,
    )


@router.post("/lessons/{lesson_id}/complete", response_model=LessonCompleteRead)
async def complete_lesson(
    lesson_id: str,
    x_idempotency_key: str | None = Header(default=None, alias="X-Idempotency-Key"),
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
    redis: CacheBackend = Depends(get_redis),
) -> LessonCompleteRead:
    lesson = get_public_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    if x_idempotency_key:
        existing = await db.scalar(
            select(LessonCompletion).where(LessonCompletion.idempotency_key == x_idempotency_key)
        )
        if existing:
            return LessonCompleteRead(
                lesson_id=existing.lesson_id,
                xp_awarded=existing.xp_awarded,
                accuracy=existing.accuracy,
                total_xp=learner.total_xp,
                level=learner.level,
                badges=[],
                edx={"synced": False, "reason": "idempotent_replay"},
            )

    prior = await db.scalar(
        select(LessonCompletion).where(
            LessonCompletion.learner_id == learner.id,
            LessonCompletion.lesson_id == lesson_id,
        )
    )
    exercise_ids = [ex["id"] for ex in lesson["exercises"]]
    correct_rows = await db.execute(
        select(Submission.exercise_id)
        .where(
            Submission.learner_id == learner.id,
            Submission.lesson_id == lesson_id,
            Submission.is_correct.is_(True),
        )
        .distinct()
    )
    correct_ids = {row[0] for row in correct_rows.all()}
    accuracy = round(100 * len(correct_ids) / max(len(exercise_ids), 1))

    awarded = 0 if prior else LESSON_COMPLETE_XP
    if prior:
        completion = prior
    else:
        if awarded:
            await _apply_xp(db, learner, awarded, "lesson_complete", lesson_id)
        completion = LessonCompletion(
            learner_id=learner.id,
            lesson_id=lesson_id,
            xp_awarded=awarded,
            accuracy=accuracy,
            idempotency_key=x_idempotency_key,
        )
        db.add(completion)

    badges: list[str] = []
    first = await award_badge(db, learner.id, "first_lesson")
    badges.append(first.badge_type)
    await db.flush()
    await publish_leaderboard(redis, learner)

    edx = await edx_client.record_completion(
        learner_id=learner.id,
        lesson_id=lesson_id,
        course_id=str(lesson.get("courseId") or ""),
    )
    return LessonCompleteRead(
        lesson_id=lesson_id,
        xp_awarded=awarded,
        accuracy=accuracy,
        total_xp=learner.total_xp,
        level=learner.level,
        badges=badges,
        edx=edx,
    )
