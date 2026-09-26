from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_learner, require_staff
from app.models.learner import Learner
from app.models.studio import AnalyticsEventRow
from app.schemas import CamelModel

router = APIRouter()


class AnalyticsEventIn(CamelModel):
    id: str | None = None
    type: str
    path_id: str | None = None
    lesson_id: str | None = None
    at: str | None = None


class AnalyticsIngestRequest(CamelModel):
    events: list[AnalyticsEventIn] = Field(default_factory=list)


class CourseStat(CamelModel):
    path_id: str
    chooses: int
    opens: int
    lesson_starts: int
    lesson_completes: int


class AnalyticsSummary(CamelModel):
    preferred: list[CourseStat]
    total_events: int


def _parse_at(value: str | None) -> datetime:
    if not value:
        return datetime.now(UTC)
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)
    except ValueError:
        return datetime.now(UTC)


@router.post("/analytics/events")
async def ingest_analytics(
    payload: AnalyticsIngestRequest,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, int]:
    stored = 0
    for event in payload.events[:500]:
        event_id = event.id or f"{learner.id}-{event.type}-{event.at or stored}"
        existing = await db.get(AnalyticsEventRow, event_id)
        if existing:
            continue
        db.add(
            AnalyticsEventRow(
                id=event_id,
                learner_id=learner.id,
                event_type=event.type,
                path_id=event.path_id,
                lesson_id=event.lesson_id,
                at=_parse_at(event.at),
            )
        )
        stored += 1
    await db.commit()
    return {"stored": stored}


@router.get("/analytics/summary", response_model=AnalyticsSummary, dependencies=[Depends(require_staff)])
async def analytics_summary(db: AsyncSession = Depends(get_db)) -> AnalyticsSummary:
    rows = (
        await db.execute(
            select(AnalyticsEventRow.path_id, AnalyticsEventRow.event_type, func.count())
            .where(AnalyticsEventRow.path_id.is_not(None))
            .group_by(AnalyticsEventRow.path_id, AnalyticsEventRow.event_type)
        )
    ).all()
    stats: dict[str, dict[str, Any]] = {}
    for path_id, event_type, count in rows:
        if not path_id:
            continue
        bucket = stats.setdefault(
            path_id,
            {"path_id": path_id, "chooses": 0, "opens": 0, "lesson_starts": 0, "lesson_completes": 0},
        )
        if event_type == "course_choose":
            bucket["chooses"] = int(count)
        elif event_type == "course_open":
            bucket["opens"] = int(count)
        elif event_type == "lesson_start":
            bucket["lesson_starts"] = int(count)
        elif event_type == "lesson_complete":
            bucket["lesson_completes"] = int(count)
    preferred = sorted(stats.values(), key=lambda item: item["chooses"] + item["opens"], reverse=True)
    total = await db.scalar(select(func.count()).select_from(AnalyticsEventRow)) or 0
    return AnalyticsSummary(preferred=[CourseStat(**item) for item in preferred], total_events=int(total))
