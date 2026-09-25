"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-09-20

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "learners",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("display_name", sa.String(length=100), nullable=False),
        sa.Column("preferred_language", sa.String(length=5), nullable=False, server_default="en"),
        sa.Column("password_hash", sa.String(length=255), nullable=True),
        sa.Column("is_guest", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("total_xp", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("level", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_learners_email", "learners", ["email"], unique=True)

    op.create_table(
        "xp_events",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("content_id", sa.String(length=200), nullable=True),
        sa.Column("idempotency_key", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_xp_events_learner_id", "xp_events", ["learner_id"])
    op.create_index("ix_xp_events_created_at", "xp_events", ["created_at"])
    op.create_index("ix_xp_events_idempotency_key", "xp_events", ["idempotency_key"], unique=True)

    op.create_table(
        "streaks",
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), primary_key=True),
        sa.Column("current_streak", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("longest_streak", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_activity_date", sa.Date(), nullable=True),
        sa.Column("freeze_tokens_remaining", sa.Integer(), nullable=False, server_default="2"),
        sa.Column("freeze_tokens_last_reset", sa.Date(), nullable=True),
    )

    op.create_table(
        "badges",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("badge_type", sa.String(length=100), nullable=False),
        sa.Column("earned_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("open_badges_json", sa.String(), nullable=True),
    )
    op.create_index("ix_badges_learner_id", "badges", ["learner_id"])
    op.create_index("ix_badges_learner_type", "badges", ["learner_id", "badge_type"], unique=True)

    op.create_table(
        "fsrs_cards",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("content_id", sa.String(length=200), nullable=False),
        sa.Column("stability", sa.Float(), nullable=False),
        sa.Column("difficulty", sa.Float(), nullable=False),
        sa.Column("due_date", sa.Date(), nullable=False),
        sa.Column("last_review", sa.Date(), nullable=True),
        sa.Column("reps", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("lapses", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("state", sa.String(length=20), nullable=False, server_default="New"),
    )
    op.create_index("ix_fsrs_cards_learner_id", "fsrs_cards", ["learner_id"])
    op.create_index("ix_fsrs_cards_due_date", "fsrs_cards", ["due_date"])
    op.create_index("ix_fsrs_learner_content", "fsrs_cards", ["learner_id", "content_id"], unique=True)
    op.create_index("ix_fsrs_due_date", "fsrs_cards", ["learner_id", "due_date"])

    op.create_table(
        "submissions",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("lesson_id", sa.String(length=200), nullable=False),
        sa.Column("exercise_id", sa.String(length=200), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("xp_awarded", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("idempotency_key", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_submissions_learner_id", "submissions", ["learner_id"])
    op.create_index("ix_submissions_lesson_id", "submissions", ["lesson_id"])
    op.create_index("ix_submissions_created_at", "submissions", ["created_at"])
    op.create_unique_constraint("uq_submissions_idempotency_key", "submissions", ["idempotency_key"])

    op.create_table(
        "lesson_completions",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("lesson_id", sa.String(length=200), nullable=False),
        sa.Column("xp_awarded", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("accuracy", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("idempotency_key", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_lesson_completions_learner_id", "lesson_completions", ["learner_id"])
    op.create_unique_constraint(
        "uq_lesson_completions_learner_lesson", "lesson_completions", ["learner_id", "lesson_id"]
    )
    op.create_unique_constraint(
        "uq_lesson_completions_idempotency_key", "lesson_completions", ["idempotency_key"]
    )


def downgrade() -> None:
    op.drop_table("lesson_completions")
    op.drop_table("submissions")
    op.drop_table("fsrs_cards")
    op.drop_table("badges")
    op.drop_table("streaks")
    op.drop_table("xp_events")
    op.drop_table("learners")
