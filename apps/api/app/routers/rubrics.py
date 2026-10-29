from __future__ import annotations

import json
import logging
import uuid
from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache import CacheBackend
from app.config import settings
from app.database import get_db
from app.deps import (
    EDUCATOR_ROLES,
    assert_self,
    get_current_educator,
    get_current_learner,
    get_redis,
    is_staff_request,
)
from app.models.feedback import FormativeFeedback
from app.models.learner import Learner
from app.models.rubric import Rubric, RubricSignOff
from app.schemas import CamelModel
from app.services.llm_rubric import evaluate_submission_response
from app.services.rate_limit import hit_window_limit

logger = logging.getLogger(__name__)

router = APIRouter()


class RubricCriterion(CamelModel):
    id: str
    label: str
    description: str
    required: bool = True
    max_score: float = Field(default=25.0, alias="maxScore", gt=0, le=1000)


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


class RubricEvaluateRequest(CamelModel):
    lesson_id: str = Field(..., alias="lessonId", max_length=200)
    exercise_id: str = Field(..., alias="exerciseId", max_length=200)
    prompt: str = Field(..., max_length=4000)
    learner_response: str = Field(..., alias="learnerResponse", max_length=8000)
    rubric_id: str | None = Field(default=None, alias="rubricId")
    criteria: list[RubricCriterion] | None = Field(default=None, max_length=20)
    async_mode: bool = Field(default=False, alias="asyncMode")


class FormativeFeedbackRead(CamelModel):
    id: str
    learner_id: str = Field(..., alias="learnerId")
    lesson_id: str = Field(..., alias="lessonId")
    exercise_id: str = Field(..., alias="exerciseId")
    status: str
    overall_score: float = Field(..., alias="overallScore")
    passed: bool
    criterion_evaluations: list[dict[str, Any]] = Field(..., alias="criterionEvaluations")
    summary: str
    strengths: list[str]
    actionable_guidance: list[str] = Field(..., alias="actionableGuidance")
    created_at: datetime = Field(..., alias="createdAt")
    completed_at: datetime | None = Field(default=None, alias="completedAt")


def _rubric_read(row: Rubric) -> RubricRead:
    return RubricRead(
        id=row.id,
        lesson_id=row.lesson_id,
        educator_id=row.educator_id,
        title=row.title,
        criteria=json.loads(row.criteria_json or "[]"),
        created_at=row.created_at,
    )


def _signoff_read(row: RubricSignOff) -> SignOffRead:
    return SignOffRead(
        id=row.id,
        rubric_id=row.rubric_id,
        learner_id=row.learner_id,
        educator_id=row.educator_id,
        criteria_met=json.loads(row.criteria_met_json or "[]"),
        evidence_note=row.evidence_note,
        signed_at=row.signed_at,
        passed=row.passed,
    )


@router.get("/rubrics", response_model=list[RubricRead])
async def list_rubrics(
    lesson_id: str | None = None,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> list[RubricRead]:
    query = select(Rubric).order_by(Rubric.created_at.desc())
    if lesson_id:
        query = query.where(Rubric.lesson_id == lesson_id)
    return [_rubric_read(row) for row in (await db.scalars(query)).all()]


@router.post("/rubrics", response_model=RubricRead, status_code=status.HTTP_201_CREATED)
async def create_rubric(
    payload: RubricCreate,
    educator: Learner = Depends(get_current_educator),
    db: AsyncSession = Depends(get_db),
) -> RubricRead:
    row = Rubric(
        lesson_id=payload.lesson_id,
        educator_id=educator.id,
        title=payload.title,
        criteria_json=json.dumps([c.model_dump() for c in payload.criteria]),
        created_at=datetime.now(UTC),
    )
    db.add(row)
    await db.commit()
    return _rubric_read(row)


@router.post("/rubrics/{rubric_id}/signoff", response_model=SignOffRead, status_code=status.HTTP_201_CREATED)
async def sign_off(
    rubric_id: str,
    payload: SignOffCreate,
    educator: Learner = Depends(get_current_educator),
    db: AsyncSession = Depends(get_db),
) -> SignOffRead:
    rubric = await db.get(Rubric, rubric_id)
    if not rubric:
        raise HTTPException(status_code=404, detail="Rubric not found")
    if payload.learner_id == educator.id:
        raise HTTPException(status_code=403, detail="Educators cannot sign off their own work")
    if not await db.get(Learner, payload.learner_id):
        raise HTTPException(status_code=404, detail="Learner not found")

    criteria = json.loads(rubric.criteria_json or "[]")
    known_ids = {c["id"] for c in criteria}
    criteria_met = [cid for cid in dict.fromkeys(payload.criteria_met) if cid in known_ids]
    required_ids = {c["id"] for c in criteria if c.get("required")}
    row = RubricSignOff(
        rubric_id=rubric_id,
        learner_id=payload.learner_id,
        educator_id=educator.id,
        criteria_met_json=json.dumps(criteria_met),
        evidence_note=payload.evidence_note,
        passed=required_ids.issubset(criteria_met),
        signed_at=datetime.now(UTC),
    )
    db.add(row)
    await db.commit()
    return _signoff_read(row)


@router.get("/rubrics/{rubric_id}/signoffs", response_model=list[SignOffRead])
async def list_signoffs(
    rubric_id: str,
    request: Request,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> list[SignOffRead]:
    query = select(RubricSignOff).where(RubricSignOff.rubric_id == rubric_id)
    if learner.role not in EDUCATOR_ROLES and not is_staff_request(request):
        query = query.where(RubricSignOff.learner_id == learner.id)  # learners see only their own results
    rows = await db.scalars(query.order_by(RubricSignOff.signed_at.desc()))
    return [_signoff_read(row) for row in rows.all()]


def _format_feedback_read(fb: FormativeFeedback) -> FormativeFeedbackRead:
    return FormativeFeedbackRead(
        id=fb.id,
        learner_id=fb.learner_id,
        lesson_id=fb.lesson_id,
        exercise_id=fb.exercise_id,
        status=fb.status,
        overall_score=fb.overall_score,
        passed=fb.passed,
        criterion_evaluations=json.loads(fb.criterion_evaluations or "[]"),
        summary=fb.summary,
        strengths=json.loads(fb.strengths or "[]"),
        actionable_guidance=json.loads(fb.actionable_guidance or "[]"),
        created_at=fb.created_at,
        completed_at=fb.completed_at,
    )


@router.post("/rubrics/evaluate", response_model=FormativeFeedbackRead, status_code=status.HTTP_201_CREATED)
async def evaluate_open_ended_submission(
    payload: RubricEvaluateRequest,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
    cache: CacheBackend = Depends(get_redis),
) -> FormativeFeedbackRead:
    """
    Submit open-ended exercise response for rubric-based formative feedback.
    Supports asynchronous Celery pipeline execution or synchronous evaluation.
    """
    limit = settings.RUBRIC_FEEDBACK_DAILY_LIMIT
    if limit > 0:
        used = await hit_window_limit(cache, kind="rubric-feedback", ip=learner.id, limit=limit, window_seconds=86_400)
        if used > limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Daily feedback limit reached ({limit} per day). Try again tomorrow.",
            )
    feedback_id = str(uuid.uuid4())
    now = datetime.now(UTC)

    # Convert custom criteria if passed (snake_case keys — the grader reads "max_score")
    criteria_dicts = [c.model_dump() for c in payload.criteria] if payload.criteria else None

    # If rubric_id was passed and in memory/db, use its criteria
    if not criteria_dicts and payload.rubric_id:
        rubric = await db.get(Rubric, payload.rubric_id)
        if rubric:
            criteria_dicts = json.loads(rubric.criteria_json or "[]") or None

    feedback_record = FormativeFeedback(
        id=feedback_id,
        learner_id=str(learner.id),
        lesson_id=payload.lesson_id,
        exercise_id=payload.exercise_id,
        prompt=payload.prompt,
        learner_response=payload.learner_response,
        rubric_id=payload.rubric_id,
        criteria_json=json.dumps(criteria_dicts) if criteria_dicts else None,
        status="pending",
        created_at=now,
    )
    db.add(feedback_record)
    # Commit before queueing so the worker can always see the row.
    await db.commit()

    if payload.async_mode:
        try:
            from app.workers.celery_app import evaluate_formative_feedback_task
            evaluate_formative_feedback_task.delay(feedback_id)
            return _format_feedback_read(feedback_record)
        except Exception as exc:
            logger.info("Celery task queueing skipped or unavailable (%s), falling back to synchronous", exc)

    # Synchronous evaluation
    result = await evaluate_submission_response(payload.prompt, payload.learner_response, criteria_dicts)
    feedback_record.overall_score = result.overall_score
    feedback_record.passed = result.passed
    feedback_record.criterion_evaluations = json.dumps([c.model_dump(by_alias=True) for c in result.criterion_evaluations])
    feedback_record.summary = result.summary
    feedback_record.strengths = json.dumps(result.strengths)
    feedback_record.actionable_guidance = json.dumps(result.actionable_guidance)
    feedback_record.status = "completed"
    feedback_record.completed_at = datetime.now(UTC)

    await db.commit()
    return _format_feedback_read(feedback_record)


@router.get("/rubrics/feedback/{feedback_id}", response_model=FormativeFeedbackRead)
async def get_formative_feedback(
    feedback_id: str,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> FormativeFeedbackRead:
    """Retrieve formative feedback report by ID."""
    fb = await db.scalar(select(FormativeFeedback).where(FormativeFeedback.id == feedback_id))
    if not fb or fb.learner_id != learner.id:
        raise HTTPException(status_code=404, detail="Feedback report not found")
    return _format_feedback_read(fb)


@router.get("/rubrics/learner/{learner_id}/feedback", response_model=list[FormativeFeedbackRead])
async def list_learner_formative_feedback(
    learner_id: str,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> list[FormativeFeedbackRead]:
    """List formative feedback history for a learner."""
    assert_self(learner, learner_id)
    rows = await db.scalars(
        select(FormativeFeedback)
        .where(FormativeFeedback.learner_id == learner_id)
        .order_by(FormativeFeedback.created_at.desc())
    )
    return [_format_feedback_read(fb) for fb in rows.all()]

