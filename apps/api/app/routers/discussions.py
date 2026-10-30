from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import Field
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_learner
from app.models.discussion import DiscussionPost, DiscussionVote
from app.models.learner import Learner
from app.schemas import CamelModel

router = APIRouter()


class PostCreate(CamelModel):
    body: str = Field(..., max_length=4000)
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


def _post_read(row: DiscussionPost) -> PostRead:
    return PostRead(
        id=row.id,
        lesson_id=row.lesson_id,
        learner_id=row.learner_id,
        author_name=row.author_name,
        body=row.body,
        parent_id=row.parent_id,
        created_at=row.created_at,
        upvotes=row.upvotes,
    )


@router.get("/lessons/{lesson_id}/posts", response_model=list[PostRead])
async def list_posts(
    lesson_id: str,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> list[PostRead]:
    rows = await db.scalars(
        select(DiscussionPost)
        .where(DiscussionPost.lesson_id == lesson_id)
        .order_by(DiscussionPost.created_at.asc())
        .limit(500)
    )
    return [_post_read(row) for row in rows.all()]


@router.post("/lessons/{lesson_id}/posts", response_model=PostRead, status_code=status.HTTP_201_CREATED)
async def create_post(
    lesson_id: str,
    payload: PostCreate,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> PostRead:
    body = payload.body.strip()
    if not body:
        raise HTTPException(status_code=400, detail="Post body cannot be empty")
    if payload.parent_id:
        parent = await db.get(DiscussionPost, payload.parent_id)
        if not parent or parent.lesson_id != lesson_id:
            raise HTTPException(status_code=404, detail="Parent post not found")

    row = DiscussionPost(
        lesson_id=lesson_id,
        learner_id=learner.id,
        author_name=learner.display_name or learner.email or "Learner",
        body=body,
        parent_id=payload.parent_id,
        upvotes=0,
        created_at=datetime.now(UTC),
    )
    db.add(row)
    await db.commit()
    return _post_read(row)


@router.post("/posts/{post_id}/upvote", response_model=UpvoteRead)
async def upvote_post(
    post_id: str,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> UpvoteRead:
    post = await db.get(DiscussionPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.add(DiscussionVote(post_id=post_id, learner_id=learner.id, created_at=datetime.now(UTC)))
    try:
        await db.flush()
    except IntegrityError:
        await db.rollback()  # already voted; report the current count
    else:
        count = await db.scalar(
            select(func.count()).select_from(DiscussionVote).where(DiscussionVote.post_id == post_id)
        )
        post.upvotes = int(count or 0)
        await db.commit()
    await db.refresh(post)
    return UpvoteRead(post_id=post_id, upvotes=post.upvotes)
