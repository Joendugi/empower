from __future__ import annotations

import math

import redis.asyncio as aioredis
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_learner, get_redis
from app.models.learner import Learner
from app.schemas import CamelModel

router = APIRouter()

LEADERBOARD_KEY = "leaderboard:xp:global"


def xp_to_level(total_xp: int) -> int:
    return math.floor(math.sqrt(total_xp / 100)) + 1


def xp_to_next_level(total_xp: int) -> int:
    current_level = xp_to_level(total_xp)
    return (current_level**2) * 100 - total_xp


class XPSummary(CamelModel):
    learner_id: str
    total_xp: int
    level: int
    xp_to_next_level: int


async def publish_leaderboard(redis: aioredis.Redis, learner: Learner) -> None:
    await redis.zadd(LEADERBOARD_KEY, {learner.id: learner.total_xp})


@router.get("/xp/me", response_model=XPSummary)
async def get_my_xp(
    learner: Learner = Depends(get_current_learner),
    redis: aioredis.Redis = Depends(get_redis),
) -> XPSummary:
    await publish_leaderboard(redis, learner)
    return XPSummary(
        learner_id=learner.id,
        total_xp=learner.total_xp,
        level=xp_to_level(learner.total_xp),
        xp_to_next_level=xp_to_next_level(learner.total_xp),
    )


@router.get("/xp/{learner_id}", response_model=XPSummary)
async def get_xp_summary(
    learner_id: str,
    db: AsyncSession = Depends(get_db),
    current: Learner = Depends(get_current_learner),
) -> XPSummary:
    if current.id != learner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot view another learner's XP")
    learner = await db.get(Learner, learner_id)
    if not learner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Learner not found")
    return XPSummary(
        learner_id=learner.id,
        total_xp=learner.total_xp,
        level=xp_to_level(learner.total_xp),
        xp_to_next_level=xp_to_next_level(learner.total_xp),
    )
