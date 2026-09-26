from __future__ import annotations

import hashlib
import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AuthChallenge(Base):
    """Email verification and password-reset tokens (hashed at rest)."""

    __tablename__ = "auth_challenges"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: secrets.token_urlsafe(12))
    learner_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    purpose: Mapped[str] = mapped_column(String(40), nullable=False)  # verify_email | reset_password
    token_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    consumed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )


def hash_challenge_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def issue_challenge_token() -> str:
    return secrets.token_urlsafe(32)


def challenge_expiry(*, hours: int = 2) -> datetime:
    return datetime.now(UTC) + timedelta(hours=hours)
