"""studio moderation analytics ops

Revision ID: 0002_studio_ops
Revises: 0001_initial
Create Date: 2026-09-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0002_studio_ops"
down_revision: Union[str, None] = "0001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "published_lessons",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("path_id", sa.String(), nullable=False),
        sa.Column("owner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("raw_json", sa.Text(), nullable=False),
        sa.Column("public_json", sa.Text(), nullable=False),
        sa.Column("content_version", sa.String(length=64), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_published_lessons_path_id", "published_lessons", ["path_id"])
    op.create_index("ix_published_lessons_owner_id", "published_lessons", ["owner_id"])

    op.create_table(
        "published_paths",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("owner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.Column("content_version", sa.String(length=64), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "curriculum_drafts",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("owner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_curriculum_drafts_owner_id", "curriculum_drafts", ["owner_id"])

    op.create_table(
        "educator_applications",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("user_id", sa.String(), nullable=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("uq_educator_applications_email", "educator_applications", ["email"], unique=True)

    op.create_table(
        "curriculum_proposals",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("educator_id", sa.String(), nullable=True),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "analytics_events",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("learner_id", sa.String(), nullable=True),
        sa.Column("event_type", sa.String(length=40), nullable=False),
        sa.Column("path_id", sa.String(length=200), nullable=True),
        sa.Column("lesson_id", sa.String(length=200), nullable=True),
        sa.Column("at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_analytics_events_type", "analytics_events", ["event_type"])
    op.create_index("ix_analytics_events_path_id", "analytics_events", ["path_id"])
    op.create_index("ix_analytics_events_at", "analytics_events", ["at"])

    op.create_table(
        "error_events",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("message", sa.String(length=500), nullable=False),
        sa.Column("path", sa.String(length=300), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_error_events_created_at", "error_events", ["created_at"])


def downgrade() -> None:
    op.drop_table("error_events")
    op.drop_table("analytics_events")
    op.drop_table("curriculum_proposals")
    op.drop_table("educator_applications")
    op.drop_table("curriculum_drafts")
    op.drop_table("published_paths")
    op.drop_table("published_lessons")
