from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_learner, get_current_registered_learner
from app.models.learner import Learner
from app.models.submission import LessonCompletion
from app.schemas import CamelModel
from app.services.content import get_public_lesson, get_skill_path, list_skill_paths
from app.services.edx import edx_client

router = APIRouter()


class ProgressRead(CamelModel):
    completed_lesson_ids: list[str]
    node_completion: dict[str, int]


@router.get("/skill-paths")
async def skill_paths(_: Learner = Depends(get_current_registered_learner)) -> list[dict]:
    return list_skill_paths()


@router.get("/skill-paths/{path_id}")
async def skill_path(
    path_id: str,
    _: Learner = Depends(get_current_registered_learner),
) -> dict:
    path = get_skill_path(path_id)
    if not path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill path not found")
    return path


@router.get("/lessons/{lesson_id}")
async def lesson_detail(
    lesson_id: str,
    _: Learner = Depends(get_current_registered_learner),
) -> dict:
    lesson = get_public_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson


@router.get("/progress/me", response_model=ProgressRead)
async def my_progress(
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> ProgressRead:
    result = await db.execute(
        select(LessonCompletion.lesson_id).where(LessonCompletion.learner_id == learner.id)
    )
    completed = [row[0] for row in result.all()]
    node_completion: dict[str, int] = {}
    for path in list_skill_paths():
        for node in path["nodes"]:
            total = max(len(node["lessonIds"]), 1)
            done = sum(1 for lid in node["lessonIds"] if lid in completed)
            node_completion[node["id"]] = round(100 * done / total)
    return ProgressRead(completed_lesson_ids=completed, node_completion=node_completion)


@router.get("/edx/status")
async def edx_status() -> dict:
    return edx_client.status()
