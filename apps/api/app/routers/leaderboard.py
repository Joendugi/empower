from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache import CacheBackend
from app.database import get_db
from app.deps import get_redis
from app.models.learner import Learner
from app.schemas import CamelModel

router = APIRouter()


class LeaderboardEntry(CamelModel):
    rank: int
    learner_id: str
    total_xp: int


async def ranked_learners(db: AsyncSession, limit: int) -> list[LeaderboardEntry]:
    rows = await db.execute(
        select(Learner.id, Learner.total_xp)
        .where(Learner.is_guest.is_(False))
        .order_by(desc(Learner.total_xp), Learner.id)
        .limit(limit)
    )
    return [
        LeaderboardEntry(rank=index + 1, learner_id=learner_id, total_xp=total_xp)
        for index, (learner_id, total_xp) in enumerate(rows.all())
    ]


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
async def get_leaderboard(
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[LeaderboardEntry]:
    return await ranked_learners(db, limit)


@router.get("/leaderboard/cohort/{cohort_id}", response_model=list[LeaderboardEntry])
async def get_cohort_leaderboard(
    cohort_id: str,
    limit: int = Query(default=20, ge=1, le=100),
    redis: CacheBackend = Depends(get_redis),
    db: AsyncSession = Depends(get_db),
) -> list[LeaderboardEntry]:
    key = f"leaderboard:xp:cohort:{cohort_id}"
    entries = await redis.zrevrange(key, 0, limit - 1, withscores=True)
    if entries:
        return [
            LeaderboardEntry(rank=i + 1, learner_id=learner_id, total_xp=int(score))
            for i, (learner_id, score) in enumerate(entries)
        ]
    return await ranked_learners(db, limit)
