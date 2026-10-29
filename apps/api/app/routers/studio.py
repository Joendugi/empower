from __future__ import annotations

import asyncio
import json
import re
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import yaml
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import EDUCATOR_ROLES, get_current_registered_learner, is_staff_request, require_staff
from app.models.learner import Learner
from app.models.studio import CurriculumDraftRow, PublishedLesson, PublishedPath
from app.schemas import CamelModel
from app.services.content import is_builtin_lesson, is_builtin_path
from app.services.published_catalog import (
    public_lesson,
    register_published_lesson,
    register_published_path,
)

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
    request: Request,
    learner: Learner = Depends(get_current_registered_learner),
    db: AsyncSession = Depends(get_db),
) -> StudioSyncResponse:
    staff = is_staff_request(request)
    # Drafts are private and open to every registered user; publishing reaches every learner.
    can_publish = staff or learner.role in EDUCATOR_ROLES
    can_overwrite_others = staff or learner.role == "admin"

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
    for item in payload.published if can_publish else []:
        path = item.get("path") if isinstance(item.get("path"), dict) else None
        lessons = item.get("lessons") if isinstance(item.get("lessons"), list) else []
        if not path or not lessons:
            continue
        path_id = str(path.get("id") or "")
        if not path_id or is_builtin_path(path_id):
            continue  # built-in programmes come from content/ YAML only
        version = str(item.get("contentVersion") or item.get("updatedAt") or _now().isoformat())
        path_row = await db.get(PublishedPath, path_id)
        if path_row and path_row.owner_id != learner.id and not can_overwrite_others:
            continue
        path_json = json.dumps(path, ensure_ascii=False)
        if path_row:
            path_row.payload_json = path_json
            path_row.content_version = version
            path_row.updated_at = _now()
            path_row.owner_id = path_row.owner_id or learner.id
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
            if is_builtin_lesson(str(lesson["id"])):
                continue
            existing = await db.get(PublishedLesson, str(lesson["id"]))
            if existing and existing.owner_id != learner.id and not can_overwrite_others:
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
            row = existing
            raw_json = json.dumps(raw, ensure_ascii=False)
            public_json = json.dumps(public, ensure_ascii=False)
            if row:
                row.path_id = path_id
                row.owner_id = row.owner_id or learner.id
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



_DRAFT_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,199}$")
_REPO_ROOT = Path(__file__).resolve().parents[4]
_DRAFTS_DIR = _REPO_ROOT / "content" / "drafts"
_LESSONS_DIR = _REPO_ROOT / "content" / "lessons"


def _find_draft(draft_id: str) -> Path:
    if not _DRAFT_ID.match(draft_id) or ".." in draft_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid draft id")
    file_path = _DRAFTS_DIR / f"{draft_id}.yaml"
    if file_path.exists():
        return file_path
    matches = sorted(_DRAFTS_DIR.glob(f"*{draft_id}*.yaml"))
    if not matches:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Draft '{draft_id}' not found")
    return matches[0]


def _run_script(name: str) -> None:
    subprocess.run([sys.executable, str(_REPO_ROOT / "scripts" / name)], check=True)


def _publish_draft(file_path: Path) -> str:
    data = yaml.safe_load(file_path.read_text(encoding="utf-8")) or {}
    clean_id = str(data.get("id") or file_path.stem)
    if not _DRAFT_ID.match(clean_id) or ".." in clean_id:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Draft has an invalid lesson id")

    data.pop("quality_audit", None)
    data.pop("status", None)
    (_LESSONS_DIR / f"{clean_id}.yaml").write_text(
        yaml.dump(data, sort_keys=False, allow_unicode=True), encoding="utf-8"
    )
    file_path.unlink()

    # Regenerate drafts manifest & catalogue
    _run_script("generate_catalogue.py")
    _run_script("generate_drafts_manifest.py")
    return clean_id


def _archive_draft(file_path: Path) -> None:
    archive_dir = _DRAFTS_DIR / "rejected"
    archive_dir.mkdir(parents=True, exist_ok=True)
    file_path.replace(archive_dir / file_path.name)
    _run_script("generate_drafts_manifest.py")


@router.post("/studio/drafts/{draft_id}/approve", dependencies=[Depends(require_staff)])
async def approve_curriculum_draft(
    draft_id: str,
    learner: Learner = Depends(get_current_registered_learner),
) -> dict[str, Any]:
    file_path = _find_draft(draft_id)
    clean_id = await asyncio.to_thread(_publish_draft, file_path)
    return {"ok": True, "message": f"Lesson '{clean_id}' approved and published to catalogue", "lessonId": clean_id}


@router.post("/studio/drafts/{draft_id}/reject", dependencies=[Depends(require_staff)])
async def reject_curriculum_draft(
    draft_id: str,
    learner: Learner = Depends(get_current_registered_learner),
) -> dict[str, Any]:
    file_path = _find_draft(draft_id)
    await asyncio.to_thread(_archive_draft, file_path)
    return {"ok": True, "message": f"Draft '{draft_id}' rejected and moved to archive", "draftId": draft_id}
