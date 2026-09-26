from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, Request
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_registered_learner
from app.models.learner import Learner
from app.models.studio import CurriculumProposalRow, EducatorApplicationRow
from app.schemas import CamelModel
from app.security import staff_key_matches

router = APIRouter()


class ModerationSyncRequest(CamelModel):
    applications: list[dict[str, Any]] = Field(default_factory=list)
    proposals: list[dict[str, Any]] = Field(default_factory=list)


class ModerationSyncResponse(CamelModel):
    applications: list[dict[str, Any]]
    proposals: list[dict[str, Any]]


def _now() -> datetime:
    return datetime.now(UTC)


def _parse(value: str) -> dict[str, Any]:
    parsed = json.loads(value)
    return parsed if isinstance(parsed, dict) else {}


def _newer(incoming: dict[str, Any], existing: dict[str, Any]) -> bool:
    return str(incoming.get("updatedAt") or incoming.get("reviewedAt") or incoming.get("submittedAt") or "") >= str(
        existing.get("updatedAt") or existing.get("reviewedAt") or existing.get("submittedAt") or ""
    )


def _is_staff(request: Request) -> bool:
    return staff_key_matches(request.headers.get("X-Staff-Key") or "")


async def _dump_moderation(db: AsyncSession, learner: Learner, staff: bool) -> ModerationSyncResponse:
    applications = [_parse(row.payload_json) for row in (await db.scalars(select(EducatorApplicationRow))).all()]
    proposals = [_parse(row.payload_json) for row in (await db.scalars(select(CurriculumProposalRow))).all()]
    if not staff:
        email = (learner.email or "").lower()
        applications = [item for item in applications if str(item.get("email") or "").lower() == email]
        proposals = [
            item
            for item in proposals
            if str(item.get("educatorId") or "") in {learner.id, email}
            or str(item.get("educatorEmail") or "").lower() == email
        ]
    return ModerationSyncResponse(applications=applications, proposals=proposals)


@router.put("/moderation/sync", response_model=ModerationSyncResponse)
async def sync_moderation(
    payload: ModerationSyncRequest,
    request: Request,
    learner: Learner = Depends(get_current_registered_learner),
    db: AsyncSession = Depends(get_db),
) -> ModerationSyncResponse:
    for application in payload.applications:
        email = str(application.get("email") or learner.email or "").strip().lower()
        if not email:
            continue
        app_id = str(application.get("id") or f"educator-{email}")
        row = await db.scalar(select(EducatorApplicationRow).where(EducatorApplicationRow.email == email))
        incoming = {**application, "id": app_id, "email": email, "userId": application.get("userId") or learner.id}
        if row:
            current = _parse(row.payload_json)
            if _newer(incoming, current):
                row.payload_json = json.dumps(incoming, ensure_ascii=False)
                row.status = str(incoming.get("status") or row.status)
                row.updated_at = _now()
        else:
            db.add(
                EducatorApplicationRow(
                    id=app_id,
                    user_id=learner.id,
                    email=email,
                    payload_json=json.dumps(incoming, ensure_ascii=False),
                    status=str(incoming.get("status") or "pending"),
                    updated_at=_now(),
                )
            )

    for proposal in payload.proposals:
        proposal_id = str(proposal.get("id") or "")
        if not proposal_id:
            continue
        row = await db.get(CurriculumProposalRow, proposal_id)
        incoming = {**proposal, "id": proposal_id, "educatorId": proposal.get("educatorId") or learner.id}
        if row:
            current = _parse(row.payload_json)
            if _newer(incoming, current):
                row.payload_json = json.dumps(incoming, ensure_ascii=False)
                row.status = str(incoming.get("status") or row.status)
                row.updated_at = _now()
        else:
            db.add(
                CurriculumProposalRow(
                    id=proposal_id,
                    educator_id=str(incoming.get("educatorId") or learner.id),
                    payload_json=json.dumps(incoming, ensure_ascii=False),
                    status=str(incoming.get("status") or "pending"),
                    updated_at=_now(),
                )
            )

    await db.commit()
    return await _dump_moderation(db, learner, staff=_is_staff(request))


@router.get("/moderation/sync", response_model=ModerationSyncResponse)
async def load_moderation(
    request: Request,
    learner: Learner = Depends(get_current_registered_learner),
    db: AsyncSession = Depends(get_db),
) -> ModerationSyncResponse:
    return await _dump_moderation(db, learner, staff=_is_staff(request))
