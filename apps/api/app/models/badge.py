from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    learner_id: Mapped[str] = mapped_column(
        String, ForeignKey("learners.id"), nullable=False, index=True
    )
    badge_type: Mapped[str] = mapped_column(String(100), nullable=False)
    earned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
    # OpenBadges v3 JSON stored as text (use JSONB in Postgres for querying)
    open_badges_json: Mapped[str | None] = mapped_column(String, nullable=True)

    __table_args__ = (
        # Prevent duplicate badges of the same type per learner
        Index("ix_badges_learner_type", "learner_id", "badge_type", unique=True),
    )
