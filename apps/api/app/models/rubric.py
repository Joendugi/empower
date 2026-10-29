from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Rubric(Base):
    __tablename__ = "rubrics"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    lesson_id: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    educator_id: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    criteria_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")  # JSON list of criteria
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )


class RubricSignOff(Base):
    __tablename__ = "rubric_signoffs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    rubric_id: Mapped[str] = mapped_column(String, ForeignKey("rubrics.id"), nullable=False, index=True)
    learner_id: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False, index=True)
    educator_id: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False)
    criteria_met_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")  # JSON list of criterion ids
    evidence_note: Mapped[str] = mapped_column(Text, nullable=False, default="")
    passed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    signed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
