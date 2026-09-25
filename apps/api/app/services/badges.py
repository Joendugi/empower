from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.badge import Badge


async def award_badge(db: AsyncSession, learner_id: str, badge_type: str) -> Badge:
    existing = await db.scalar(
        select(Badge).where(Badge.learner_id == learner_id, Badge.badge_type == badge_type)
    )
    if existing:
        return existing
    badge = Badge(learner_id=learner_id, badge_type=badge_type)
    db.add(badge)
    await db.flush()
    return badge
