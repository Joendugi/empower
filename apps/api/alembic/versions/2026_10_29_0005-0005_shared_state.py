"""discussions, votes, library uploads and reading progress move out of process memory

Revision ID: 0005_shared_state
Revises: 0004_rubrics_feedback
Create Date: 2026-10-29

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0005_shared_state"
down_revision: str | None = "0004_rubrics_feedback"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _has_table(name: str) -> bool:
    return sa.inspect(op.get_bind()).has_table(name)


def upgrade() -> None:
    # Supabase installs may already have discussion_posts from supabase/migrations.
    if not _has_table("discussion_posts"):
        op.create_table(
            "discussion_posts",
            sa.Column("id", sa.String(), primary_key=True),
            sa.Column("lesson_id", sa.String(length=200), nullable=False),
            sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
            sa.Column("author_name", sa.String(length=200), nullable=False),
            sa.Column("body", sa.Text(), nullable=False),
            sa.Column("parent_id", sa.String(), sa.ForeignKey("discussion_posts.id"), nullable=True),
            sa.Column("upvotes", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        )
        op.create_index("ix_discussion_posts_lesson_id", "discussion_posts", ["lesson_id"])
        op.create_index("ix_discussion_posts_learner_id", "discussion_posts", ["learner_id"])
    op.create_table(
        "discussion_votes",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("post_id", sa.String(), sa.ForeignKey("discussion_posts.id"), nullable=False),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("post_id", "learner_id", name="uq_discussion_vote"),
    )
    op.create_index("ix_discussion_votes_post_id", "discussion_votes", ["post_id"])
    op.create_table(
        "library_books",
        sa.Column("id", sa.String(length=40), primary_key=True),
        sa.Column("uploaded_by", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("payload_json", sa.Text(), nullable=False),
        sa.Column("file_key", sa.String(length=300), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_library_books_uploaded_by", "library_books", ["uploaded_by"])
    op.create_index("ix_library_books_created_at", "library_books", ["created_at"])
    op.create_table(
        "reading_progress",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("book_id", sa.String(length=40), nullable=False),
        sa.Column("current_page", sa.Integer(), nullable=False),
        sa.Column("total_pages", sa.Integer(), nullable=False),
        sa.Column("bookmarks_json", sa.Text(), nullable=False, server_default="[]"),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("last_read_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("learner_id", "book_id", name="uq_reading_progress"),
    )
    op.create_index("ix_reading_progress_learner_id", "reading_progress", ["learner_id"])


def downgrade() -> None:
    op.drop_table("reading_progress")
    op.drop_table("library_books")
    op.drop_table("discussion_votes")
    # discussion_posts is left in place: it may predate this revision (Supabase installs).
