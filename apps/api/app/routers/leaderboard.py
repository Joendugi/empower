from __future__ import annotations

import redis.asyncio as aioredis
from fastapi import APIRouter, Depends, Query

from app.deps import get_redis
from app.schemas import CamelModel

router = APIRouter()

GLOBAL_KEY = "leaderboard:xp:global"


class LeaderboardEntry(CamelModel):
    rank: int
    learner_id: str
    total_xp: int


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
async def get_leaderboard(
    limit: int = Query(default=20, ge=1, le=100),
    redis: aioredis.Redis = Depends(get_redis),
) -> list[LeaderboardEntry]:
    entries = await redis.zrevrange(GLOBAL_KEY, 0, limit - 1, withscores=True)
    return [
        LeaderboardEntry(rank=i + 1, learner_id=learner_id, total_xp=int(score))
        for i, (learner_id, score) in enumerate(entries)
    ]


@router.get("/leaderboard/cohort/{cohort_id}", response_model=list[LeaderboardEntry])
async def get_cohort_leaderboard(
    cohort_id: str,
    limit: int = Query(default=20, ge=1, le=100),
    redis: aioredis.Redis = Depends(get_redis),
) -> list[LeaderboardEntry]:
    key = f"leaderboard:xp:cohort:{cohort_id}"
    entries = await redis.zrevrange(key, 0, limit - 1, withscores=True)
    return [
        LeaderboardEntry(rank=i + 1, learner_id=learner_id, total_xp=int(score))
        for i, (learner_id, score) in enumerate(entries)
    ]
