from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import Date, Float, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class FSRSCard(Base):
    """
    Represents one learner–concept spaced-repetition card.
    Uses the FSRS-4.5 algorithm (see app/services/fsrs.py).

    Fields:
    - stability: expected days until retention drops to 90%
    - difficulty: 0.1 (easy) → 1.0 (hard), reflects learner's personal difficulty
    - due_date: next scheduled review date
    - state: New | Learning | Review | Relearning
    """

    __tablename__ = "fsrs_cards"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    learner_id: Mapped[str] = mapped_column(
        String, ForeignKey("learners.id"), nullable=False, index=True
    )
    content_id: Mapped[str] = mapped_column(String(200), nullable=False)
    stability: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    difficulty: Mapped[float] = mapped_column(Float, nullable=False, default=0.3)
    due_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    last_review: Mapped[date | None] = mapped_column(Date, nullable=True)
    reps: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    lapses: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    state: Mapped[str] = mapped_column(String(20), nullable=False, default="New")

    __table_args__ = (
        Index("ix_fsrs_learner_content", "learner_id", "content_id", unique=True),
        Index("ix_fsrs_due_date", "learner_id", "due_date"),
    )
