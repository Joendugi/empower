from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class FormativeFeedback(Base):
    __tablename__ = "formative_feedbacks"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    learner_id: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False, index=True)
    lesson_id: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    exercise_id: Mapped[str] = mapped_column(String(200), nullable=False)
    submission_id: Mapped[str | None] = mapped_column(String, nullable=True)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    learner_response: Mapped[str] = mapped_column(Text, nullable=False)
    rubric_id: Mapped[str | None] = mapped_column(String, nullable=True)
    criteria_json: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON criteria used for grading; null = defaults
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")  # pending, processing, completed, failed
    overall_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    passed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    criterion_evaluations: Mapped[str] = mapped_column(Text, nullable=False, default="[]")  # JSON encoded list of criteria results
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    strengths: Mapped[str] = mapped_column(Text, nullable=False, default="[]")  # JSON encoded list
    actionable_guidance: Mapped[str] = mapped_column(Text, nullable=False, default="[]")  # JSON encoded list
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), index=True
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
