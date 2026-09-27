from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_registered_learner
from app.models.badge import Badge
from app.models.learner import Learner
from app.models.submission import LessonCompletion
from app.schemas import CamelModel
from app.services.badges import award_badge
from app.services.certificates import (
    attach_open_badge,
    certificate_verify_url,
    finalize_open_badge,
    issuer_profile,
    open_badge_assertion,
)
from app.services.content import get_skill_path
from app.services.pdf import build_certificate_pdf

router = APIRouter()


class ClaimCertificateRequest(CamelModel):
    path_id: str = Field(min_length=1, max_length=200)
    path_title: str | None = Field(default=None, max_length=200)
    lesson_ids: list[str] = Field(default_factory=list, max_length=500)


class CertificateRead(CamelModel):
    id: str
    badge_type: str
    path_id: str | None = None
    earned_at: str
    open_badge: dict | None = None


def _lesson_ids_for_path(path_id: str, provided: list[str]) -> list[str]:
    cleaned = [str(item).strip() for item in provided if str(item).strip()]
    if cleaned:
        return cleaned
    path = get_skill_path(path_id)
    if not path:
        return []
    ids: list[str] = []
    for node in path.get("nodes") or []:
        ids.extend(str(lesson_id) for lesson_id in (node.get("lessonIds") or node.get("lesson_ids") or []))
    return ids


@router.get("/certificates/me", response_model=list[CertificateRead])
async def list_certificates(
    learner: Learner = Depends(get_current_registered_learner),
    db: AsyncSession = Depends(get_db),
) -> list[CertificateRead]:
    rows = (
        await db.scalars(
            select(Badge).where(
                Badge.learner_id == learner.id,
                Badge.badge_type.like("cert:%"),
            )
        )
    ).all()
    out: list[CertificateRead] = []
    for row in rows:
        assertion = None
        path_id = None
        if row.open_badges_json:
            try:
                assertion = json.loads(row.open_badges_json)
                path_id = (assertion.get("empower") or {}).get("pathId")
            except json.JSONDecodeError:
                assertion = None
        out.append(
            CertificateRead(
                id=row.id,
                badge_type=row.badge_type,
                path_id=path_id,
                earned_at=row.earned_at.isoformat(),
                open_badge=assertion,
            )
        )
    return out


@router.post("/certificates/claim", response_model=CertificateRead, status_code=status.HTTP_201_CREATED)
async def claim_certificate(
    payload: ClaimCertificateRequest,
    learner: Learner = Depends(get_current_registered_learner),
    db: AsyncSession = Depends(get_db),
) -> CertificateRead:
    lesson_ids = _lesson_ids_for_path(payload.path_id, payload.lesson_ids)
    if not lesson_ids:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Programme has no lessons")

    path = get_skill_path(payload.path_id)
    title = payload.path_title or (str(path.get("title")) if path else payload.path_id)

    completed = set(
        (
            await db.scalars(
                select(LessonCompletion.lesson_id).where(
                    LessonCompletion.learner_id == learner.id,
                    LessonCompletion.lesson_id.in_(lesson_ids),
                )
            )
        ).all()
    )
    if not set(lesson_ids).issubset(completed):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Finish every week in this programme before claiming a certificate",
        )

    badge_type = f"cert:{payload.path_id}"
    assertion = open_badge_assertion(
        learner_id=learner.id,
        learner_name=learner.display_name,
        badge_type=badge_type,
        path_id=payload.path_id,
        path_title=title,
    )
    badge = await award_badge(
        db,
        learner.id,
        badge_type,
        open_badges_json=json.dumps(assertion, ensure_ascii=False),
    )
    stored = assertion
    if badge.open_badges_json:
        try:
            stored = json.loads(badge.open_badges_json)
        except json.JSONDecodeError:
            stored = assertion
    stored = finalize_open_badge(stored, badge.id)
    attach_open_badge(badge, stored)
    await db.flush()
    return CertificateRead(
        id=badge.id,
        badge_type=badge.badge_type,
        path_id=payload.path_id,
        earned_at=badge.earned_at.isoformat(),
        open_badge=stored,
    )


@router.get("/issuer")
async def get_issuer() -> dict:
    return issuer_profile()


async def _load_certificate(certificate_id: str, db: AsyncSession) -> Badge:
    badge = await db.get(Badge, certificate_id)
    if badge is None or not (badge.badge_type or "").startswith("cert:"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    return badge


def _assertion_for(badge: Badge) -> dict:
    if not badge.open_badges_json:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    try:
        assertion = json.loads(badge.open_badges_json)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found") from exc
    return finalize_open_badge(assertion, badge.id)


@router.get("/certificates/{certificate_id}")
async def verify_certificate(certificate_id: str, db: AsyncSession = Depends(get_db)) -> dict:
    badge = await _load_certificate(certificate_id, db)
    return _assertion_for(badge)


@router.get("/certificates/{certificate_id}/pdf")
async def download_certificate_pdf(certificate_id: str, db: AsyncSession = Depends(get_db)) -> Response:
    badge = await _load_certificate(certificate_id, db)
    assertion = _assertion_for(badge)
    subject = assertion.get("credentialSubject") or {}
    achievement = subject.get("achievement") or {}
    pdf = build_certificate_pdf(
        learner_name=str(subject.get("name") or "Learner"),
        path_title=str(achievement.get("name") or assertion.get("name") or "Certificate"),
        issued=str(assertion.get("issuanceDate") or badge.earned_at.isoformat()),
        certificate_id=badge.id,
        verify_url=str((assertion.get("empower") or {}).get("verifyUrl") or certificate_verify_url(badge.id)),
    )
    filename = f"empower-{badge.id[:8]}.pdf"
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )
