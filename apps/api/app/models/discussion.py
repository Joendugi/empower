from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class DiscussionPost(Base):
    __tablename__ = "discussion_posts"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    lesson_id: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    learner_id: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False, index=True)
    author_name: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    parent_id: Mapped[str | None] = mapped_column(String, ForeignKey("discussion_posts.id"), nullable=True)
    upvotes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )


class DiscussionVote(Base):
    """One row per learner per post, so a learner can only upvote once."""

    __tablename__ = "discussion_votes"
    __table_args__ = (UniqueConstraint("post_id", "learner_id", name="uq_discussion_vote"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id: Mapped[str] = mapped_column(String, ForeignKey("discussion_posts.id"), nullable=False, index=True)
    learner_id: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
