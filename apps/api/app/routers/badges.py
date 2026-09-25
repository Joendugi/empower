from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_learner
from app.models.badge import Badge
from app.models.learner import Learner
from app.schemas import CamelModel

router = APIRouter()


class BadgeRead(CamelModel):
    id: str
    learner_id: str
    badge_type: str
    earned_at: str


@router.get("/badges/me", response_model=list[BadgeRead])
async def list_my_badges(
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> list[BadgeRead]:
    result = await db.execute(select(Badge).where(Badge.learner_id == learner.id))
    badges = result.scalars().all()
    return [
        BadgeRead(
            id=b.id,
            learner_id=b.learner_id,
            badge_type=b.badge_type,
            earned_at=b.earned_at.isoformat(),
        )
        for b in badges
    ]
