from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.badge import Badge


async def award_badge(
    db: AsyncSession,
    learner_id: str,
    badge_type: str,
    *,
    open_badges_json: str | None = None,
) -> Badge:
    existing = await db.scalar(
        select(Badge).where(Badge.learner_id == learner_id, Badge.badge_type == badge_type)
    )
    if existing:
        if open_badges_json and not existing.open_badges_json:
            existing.open_badges_json = open_badges_json
        return existing
    badge = Badge(learner_id=learner_id, badge_type=badge_type, open_badges_json=open_badges_json)
    db.add(badge)
    await db.flush()
    return badge
