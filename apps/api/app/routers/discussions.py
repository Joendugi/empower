from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_learner
from app.models.learner import Learner
from app.schemas import CamelModel

router = APIRouter()


class PostCreate(CamelModel):
    body: str
    parent_id: str | None = None


class PostRead(CamelModel):
    id: str
    lesson_id: str
    learner_id: str
    author_name: str
    body: str
    parent_id: str | None
    created_at: datetime
    upvotes: int


class UpvoteRead(CamelModel):
    post_id: str
    upvotes: int


# In-memory store as fallback when table doesn't exist yet
_posts: dict[str, list[dict]] = {}
_upvotes: dict[str, set[str]] = {}


async def _db_posts_exist(db: AsyncSession) -> bool:
    try:
        from sqlalchemy import text
        await db.execute(text("SELECT 1 FROM discussion_posts LIMIT 1"))
        return True
    except Exception:
        return False


@router.get("/lessons/{lesson_id}/posts", response_model=list[PostRead])
async def list_posts(
    lesson_id: str,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> list[PostRead]:
    if await _db_posts_exist(db):
        from sqlalchemy import text
        rows = await db.execute(
            text("SELECT id, lesson_id, learner_id, author_name, body, parent_id, created_at, upvotes FROM discussion_posts WHERE lesson_id = :lid ORDER BY created_at ASC"),
            {"lid": lesson_id},
        )
        return [
            PostRead(
                id=str(r.id),
                lesson_id=str(r.lesson_id),
                learner_id=str(r.learner_id),
                author_name=r.author_name,
                body=r.body,
                parent_id=str(r.parent_id) if r.parent_id else None,
                created_at=r.created_at,
                upvotes=r.upvotes,
            )
            for r in rows.mappings().all()
        ]
    # fallback
    posts = _posts.get(lesson_id, [])
    return [PostRead(**p) for p in posts]


@router.post("/lessons/{lesson_id}/posts", response_model=PostRead, status_code=status.HTTP_201_CREATED)
async def create_post(
    lesson_id: str,
    payload: PostCreate,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> PostRead:
    if not payload.body.strip():
        raise HTTPException(status_code=400, detail="Post body cannot be empty")

    post_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    author_name = getattr(learner, "display_name", None) or getattr(learner, "email", "Learner")

    if await _db_posts_exist(db):
        from sqlalchemy import text
        await db.execute(
            text("INSERT INTO discussion_posts (id, lesson_id, learner_id, author_name, body, parent_id, created_at, upvotes) VALUES (:id, :lid, :learner, :author, :body, :parent, :now, 0)"),
            {"id": post_id, "lid": lesson_id, "learner": str(learner.id), "author": author_name, "body": payload.body, "parent": payload.parent_id, "now": now},
        )
        await db.commit()
    else:
        entry = {
            "id": post_id,
            "lesson_id": lesson_id,
            "learner_id": str(learner.id),
            "author_name": author_name,
            "body": payload.body,
            "parent_id": payload.parent_id,
            "created_at": now,
            "upvotes": 0,
        }
        _posts.setdefault(lesson_id, []).append(entry)

    return PostRead(
        id=post_id,
        lesson_id=lesson_id,
        learner_id=str(learner.id),
        author_name=author_name,
        body=payload.body,
        parent_id=payload.parent_id,
        created_at=now,
        upvotes=0,
    )


@router.post("/posts/{post_id}/upvote", response_model=UpvoteRead)
async def upvote_post(
    post_id: str,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> UpvoteRead:
    if await _db_posts_exist(db):
        from sqlalchemy import text
        await db.execute(
            text("UPDATE discussion_posts SET upvotes = upvotes + 1 WHERE id = :id"),
            {"id": post_id},
        )
        await db.commit()
        row = await db.execute(text("SELECT upvotes FROM discussion_posts WHERE id = :id"), {"id": post_id})
        result = row.mappings().first()
        return UpvoteRead(post_id=post_id, upvotes=result["upvotes"] if result else 1)
    voters = _upvotes.setdefault(post_id, set())
    voters.add(str(learner.id))
    for posts in _posts.values():
        for p in posts:
            if p["id"] == post_id:
                p["upvotes"] = len(voters)
                return UpvoteRead(post_id=post_id, upvotes=p["upvotes"])
    return UpvoteRead(post_id=post_id, upvotes=1)
