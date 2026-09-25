from __future__ import annotations

from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Streak(Base):
    __tablename__ = "streaks"

    learner_id: Mapped[str] = mapped_column(
        String, ForeignKey("learners.id"), primary_key=True
    )
    current_streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_activity_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    # Freeze tokens: 2 per month; using one prevents streak reset if learner misses a day
    freeze_tokens_remaining: Mapped[int] = mapped_column(Integer, nullable=False, default=2)
    freeze_tokens_last_reset: Mapped[date | None] = mapped_column(Date, nullable=True)
