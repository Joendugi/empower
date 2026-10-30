from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class LibraryBook(Base):
    """An educator-uploaded book. Seeded books stay in code; uploads live here."""

    __tablename__ = "library_books"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    uploaded_by: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False, index=True)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False)  # book metadata + content, API shape
    file_key: Mapped[str] = mapped_column(String(300), nullable=False)  # original upload in object storage
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), index=True
    )


class ReadingProgress(Base):
    __tablename__ = "reading_progress"
    __table_args__ = (UniqueConstraint("learner_id", "book_id", name="uq_reading_progress"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    learner_id: Mapped[str] = mapped_column(String, ForeignKey("learners.id"), nullable=False, index=True)
    book_id: Mapped[str] = mapped_column(String(40), nullable=False)
    current_page: Mapped[int] = mapped_column(Integer, nullable=False)
    total_pages: Mapped[int] = mapped_column(Integer, nullable=False)
    bookmarks_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    last_read_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
