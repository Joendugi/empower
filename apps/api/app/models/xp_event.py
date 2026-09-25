from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class XPEvent(Base):
    __tablename__ = "xp_events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    learner_id: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False, index=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    # Source of XP: exercise_correct, streak_bonus, badge_earned, lesson_complete, etc.
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    content_id: Mapped[str | None] = mapped_column(String(200), nullable=True)
    # Client-provided idempotency key for offline sync deduplication
    idempotency_key: Mapped[str | None] = mapped_column(String(100), nullable=True, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), index=True
    )
