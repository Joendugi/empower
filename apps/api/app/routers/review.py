from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache import CacheBackend
from app.database import get_db
from app.deps import get_current_learner, get_redis
from app.models.fsrs_card import FSRSCard
from app.models.learner import Learner
from app.models.xp_event import XPEvent
from app.routers.xp import publish_leaderboard, xp_to_level
from app.schemas import CamelModel
from app.services.fsrs import next_interval

router = APIRouter()

REVIEW_SESSION_LIMIT = 15
XP_PER_REVIEW_CARD = 10


class ReviewCard(CamelModel):
    content_id: str
    due_date: date
    reps: int
    state: str


class ReviewSession(CamelModel):
    learner_id: str
    cards: list[ReviewCard]
    generated_at: str
    total_due: int


class ReviewResult(CamelModel):
    content_id: str
    rating: int = Field(ge=1, le=4, description="1=Again, 2=Hard, 3=Good, 4=Easy")


class ReviewResultResponse(CamelModel):
    content_id: str
    new_stability: float
    new_difficulty: float
    next_due_date: date
    xp_awarded: int
    total_xp: int
    level: int


@router.get("/review/session", response_model=ReviewSession)
async def get_review_session(
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> ReviewSession:
    today = date.today()
    result = await db.execute(
        select(FSRSCard)
        .where(FSRSCard.learner_id == learner.id, FSRSCard.due_date <= today)
        .order_by(FSRSCard.due_date)
        .limit(REVIEW_SESSION_LIMIT)
    )
    cards = result.scalars().all()
    total_due = await db.scalar(
        select(func.count()).select_from(FSRSCard).where(
            FSRSCard.learner_id == learner.id, FSRSCard.due_date <= today
        )
    )
    return ReviewSession(
        learner_id=learner.id,
        cards=[
            ReviewCard(
                content_id=c.content_id,
                due_date=c.due_date,
                reps=c.reps,
                state=c.state,
            )
            for c in cards
        ],
        generated_at=date.today().isoformat(),
        total_due=int(total_due or 0),
    )


@router.post("/review/result", response_model=ReviewResultResponse)
async def submit_review_result(
    result: ReviewResult,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
    redis: CacheBackend = Depends(get_redis),
) -> ReviewResultResponse:
    card = await db.scalar(
        select(FSRSCard).where(
            FSRSCard.learner_id == learner.id,
            FSRSCard.content_id == result.content_id,
        )
    )
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    update = next_interval(
        stability=card.stability,
        difficulty=card.difficulty,
        reps=card.reps,
        lapses=card.lapses,
        state=card.state,
        due_date=card.due_date,
        last_review=card.last_review,
        rating=result.rating,
    )

    card.stability = update.stability
    card.difficulty = update.difficulty
    card.due_date = update.due_date
    card.last_review = date.today()
    card.reps = update.reps
    card.lapses = update.lapses
    card.state = update.state

    learner.total_xp += XP_PER_REVIEW_CARD
    learner.level = xp_to_level(learner.total_xp)
    db.add(
        XPEvent(
            learner_id=learner.id,
            amount=XP_PER_REVIEW_CARD,
            source="review_card",
            content_id=result.content_id,
        )
    )
    await db.flush()
    await publish_leaderboard(redis, learner)
    return ReviewResultResponse(
        content_id=card.content_id,
        new_stability=card.stability,
        new_difficulty=card.difficulty,
        next_due_date=card.due_date,
        xp_awarded=XP_PER_REVIEW_CARD,
        total_xp=learner.total_xp,
        level=learner.level,
    )
