from __future__ import annotations

from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_learner
from app.models.learner import Learner
from app.models.streak import Streak
from app.schemas import CamelModel
from app.services.badges import award_badge

router = APIRouter()


class StreakRead(CamelModel):
    learner_id: str
    current_streak: int
    longest_streak: int
    last_activity_date: date | None
    freeze_tokens_remaining: int


def _read(learner_id: str, streak: Streak | None) -> StreakRead:
    if not streak:
        return StreakRead(
            learner_id=learner_id,
            current_streak=0,
            longest_streak=0,
            last_activity_date=None,
            freeze_tokens_remaining=2,
        )
    return StreakRead(
        learner_id=streak.learner_id,
        current_streak=streak.current_streak,
        longest_streak=streak.longest_streak,
        last_activity_date=streak.last_activity_date,
        freeze_tokens_remaining=streak.freeze_tokens_remaining,
    )


async def apply_activity(db: AsyncSession, learner_id: str) -> Streak:
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
    if streak.last_activity_date == today - timedelta(days=1):
        streak.current_streak += 1
        streak.longest_streak = max(streak.longest_streak, streak.current_streak)
        streak.last_activity_date = today
    elif streak.last_activity_date == today - timedelta(days=2) and streak.freeze_tokens_remaining > 0:
        streak.freeze_tokens_remaining -= 1
        streak.current_streak += 1
        streak.longest_streak = max(streak.longest_streak, streak.current_streak)
        streak.last_activity_date = today
    else:
        streak.current_streak = 1
        streak.last_activity_date = today
    if streak.current_streak >= 30:
        await award_badge(db, learner_id, "streak_30")
    elif streak.current_streak >= 7:
        await award_badge(db, learner_id, "streak_7")
    await db.flush()
    return streak


@router.get("/streaks/me", response_model=StreakRead)
async def get_my_streak(
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> StreakRead:
    streak = await db.get(Streak, learner.id)
    return _read(learner.id, streak)


@router.post("/streaks/activity", response_model=StreakRead)
async def record_my_activity(
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> StreakRead:
    streak = await apply_activity(db, learner.id)
    return _read(learner.id, streak)


@router.post("/streaks/freeze", response_model=StreakRead)
async def use_my_freeze(
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> StreakRead:
    streak = await db.get(Streak, learner.id)
    if not streak:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No streak found")
    if streak.freeze_tokens_remaining <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No freeze tokens remaining")
    streak.freeze_tokens_remaining -= 1
    await db.flush()
    return _read(learner.id, streak)
