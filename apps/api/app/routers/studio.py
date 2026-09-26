from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, status
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_registered_learner
from app.models.learner import Learner
from app.models.studio import CurriculumDraftRow, PublishedLesson, PublishedPath
from app.schemas import CamelModel
from app.services.published_catalog import public_lesson, register_published_lesson, register_published_path

router = APIRouter()


class StudioSyncRequest(CamelModel):
    drafts: list[dict[str, Any]] = Field(default_factory=list)
    published: list[dict[str, Any]] = Field(default_factory=list)


class StudioSyncResponse(CamelModel):
    drafts: list[dict[str, Any]]
    published: list[dict[str, Any]]


def _now() -> datetime:
    return datetime.now(UTC)


def _parse(value: str) -> dict[str, Any]:
    parsed = json.loads(value)
    return parsed if isinstance(parsed, dict) else {}


@router.put("/studio/sync", response_model=StudioSyncResponse)
async def sync_studio(
    payload: StudioSyncRequest,
    learner: Learner = Depends(get_current_registered_learner),
    db: AsyncSession = Depends(get_db),
) -> StudioSyncResponse:
    for draft in payload.drafts:
        draft_id = str(draft.get("id") or "")
        if not draft_id:
            continue
        row = await db.get(CurriculumDraftRow, draft_id)
        incoming = json.dumps(draft, ensure_ascii=False)
        if row and row.owner_id != learner.id:
            continue
        if row:
            row.payload_json = incoming
            row.updated_at = _now()
        else:
            db.add(
                CurriculumDraftRow(
                    id=draft_id,
                    owner_id=learner.id,
                    payload_json=incoming,
                    updated_at=_now(),
                )
            )

    published_out: list[dict[str, Any]] = []
    for item in payload.published:
        path = item.get("path") if isinstance(item.get("path"), dict) else None
        lessons = item.get("lessons") if isinstance(item.get("lessons"), list) else []
        if not path or not lessons:
            continue
        path_id = str(path.get("id") or "")
        version = str(item.get("contentVersion") or item.get("updatedAt") or _now().isoformat())
        path_row = await db.get(PublishedPath, path_id)
        path_json = json.dumps(path, ensure_ascii=False)
        if path_row:
            path_row.payload_json = path_json
            path_row.content_version = version
            path_row.updated_at = _now()
            path_row.owner_id = learner.id
        else:
            db.add(
                PublishedPath(
                    id=path_id,
                    owner_id=learner.id,
                    payload_json=path_json,
                    content_version=version,
                    updated_at=_now(),
                )
            )
        register_published_path(path)
        published_lessons = []
        for lesson in lessons:
            if not isinstance(lesson, dict) or not lesson.get("id"):
                continue
            raw = {
                **lesson,
                "id": str(lesson["id"]),
                "course_id": path_id,
                "exercises": lesson.get("exercises") or [],
            }
            public = public_lesson(raw, version)
            register_published_lesson(raw, public)
            lesson_id = raw["id"]
            row = await db.get(PublishedLesson, lesson_id)
            raw_json = json.dumps(raw, ensure_ascii=False)
            public_json = json.dumps(public, ensure_ascii=False)
            if row:
                row.path_id = path_id
                row.owner_id = learner.id
                row.raw_json = raw_json
                row.public_json = public_json
                row.content_version = version
                row.updated_at = _now()
            else:
                db.add(
                    PublishedLesson(
                        id=lesson_id,
                        path_id=path_id,
                        owner_id=learner.id,
                        raw_json=raw_json,
                        public_json=public_json,
                        content_version=version,
                        updated_at=_now(),
                    )
                )
            published_lessons.append(public)
        published_out.append({"path": path, "lessons": published_lessons, "contentVersion": version})

    await db.commit()

    draft_rows = (
        await db.scalars(select(CurriculumDraftRow).where(CurriculumDraftRow.owner_id == learner.id))
    ).all()
    path_rows = (await db.scalars(select(PublishedPath).where(PublishedPath.owner_id == learner.id))).all()
    lesson_rows = (await db.scalars(select(PublishedLesson).where(PublishedLesson.owner_id == learner.id))).all()
    lessons_by_path: dict[str, list[dict[str, Any]]] = {}
    for lesson in lesson_rows:
        lessons_by_path.setdefault(lesson.path_id, []).append(_parse(lesson.public_json))
    merged_published = [
        {
            "path": _parse(path.payload_json),
            "lessons": lessons_by_path.get(path.id, []),
            "contentVersion": path.content_version,
        }
        for path in path_rows
    ]
    return StudioSyncResponse(
        drafts=[_parse(row.payload_json) for row in draft_rows],
        published=merged_published or published_out,
    )


@router.get("/studio/sync", response_model=StudioSyncResponse)
async def load_studio(
    learner: Learner = Depends(get_current_registered_learner),
    db: AsyncSession = Depends(get_db),
) -> StudioSyncResponse:
    return await sync_studio(StudioSyncRequest(), learner, db)
