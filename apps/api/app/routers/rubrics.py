from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_learner
from app.models.learner import Learner
from app.schemas import CamelModel

router = APIRouter()


class RubricCriterion(CamelModel):
    id: str
    label: str
    description: str
    required: bool = True


class RubricCreate(CamelModel):
    lesson_id: str
    title: str
    criteria: list[RubricCriterion]


class RubricRead(CamelModel):
    id: str
    lesson_id: str
    educator_id: str
    title: str
    criteria: list[RubricCriterion]
    created_at: datetime


class SignOffCreate(CamelModel):
    learner_id: str
    evidence_note: str
    criteria_met: list[str]  # list of criterion IDs that were observed


class SignOffRead(CamelModel):
    id: str
    rubric_id: str
    learner_id: str
    educator_id: str
    criteria_met: list[str]
    evidence_note: str
    signed_at: datetime
    passed: bool


# In-memory fallback
_rubrics: dict[str, dict] = {}
_signoffs: list[dict] = []


async def _table_exists(db: AsyncSession, table: str) -> bool:
    try:
        from sqlalchemy import text
        await db.execute(text(f"SELECT 1 FROM {table} LIMIT 1"))
        return True
    except Exception:
        return False


@router.get("/rubrics", response_model=list[RubricRead])
async def list_rubrics(
    lesson_id: str | None = None,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> list[RubricRead]:
    items = list(_rubrics.values())
    if lesson_id:
        items = [r for r in items if r["lesson_id"] == lesson_id]
    return [RubricRead(**r) for r in items]


@router.post("/rubrics", response_model=RubricRead, status_code=status.HTTP_201_CREATED)
async def create_rubric(
    payload: RubricCreate,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> RubricRead:
    rubric_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    rubric = {
        "id": rubric_id,
        "lesson_id": payload.lesson_id,
        "educator_id": str(learner.id),
        "title": payload.title,
        "criteria": [c.model_dump() for c in payload.criteria],
        "created_at": now,
    }
    _rubrics[rubric_id] = rubric
    return RubricRead(**rubric)


@router.post("/rubrics/{rubric_id}/signoff", response_model=SignOffRead, status_code=status.HTTP_201_CREATED)
async def sign_off(
    rubric_id: str,
    payload: SignOffCreate,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> SignOffRead:
    rubric = _rubrics.get(rubric_id)
    if not rubric:
        raise HTTPException(status_code=404, detail="Rubric not found")
    required_ids = {c["id"] for c in rubric["criteria"] if c.get("required")}
    passed = required_ids.issubset(set(payload.criteria_met))
    signoff_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    entry = {
        "id": signoff_id,
        "rubric_id": rubric_id,
        "learner_id": payload.learner_id,
        "educator_id": str(learner.id),
        "criteria_met": payload.criteria_met,
        "evidence_note": payload.evidence_note,
        "signed_at": now,
        "passed": passed,
    }
    _signoffs.append(entry)
    return SignOffRead(**entry)


@router.get("/rubrics/{rubric_id}/signoffs", response_model=list[SignOffRead])
async def list_signoffs(
    rubric_id: str,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> list[SignOffRead]:
    return [SignOffRead(**s) for s in _signoffs if s["rubric_id"] == rubric_id]
