"""learner roles, rubrics, sign-offs and formative feedback reports

Revision ID: 0004_rubrics_feedback
Revises: 0003_auth_challenges
Create Date: 2026-10-29

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0004_rubrics_feedback"
down_revision: str | None = "0003_auth_challenges"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "learners",
        sa.Column("role", sa.String(length=20), nullable=False, server_default="learner"),
    )
    op.create_table(
        "rubrics",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("lesson_id", sa.String(length=200), nullable=False),
        sa.Column("educator_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("title", sa.String(length=300), nullable=False),
        sa.Column("criteria_json", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_rubrics_lesson_id", "rubrics", ["lesson_id"])
    op.create_index("ix_rubrics_educator_id", "rubrics", ["educator_id"])
    op.create_table(
        "rubric_signoffs",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("rubric_id", sa.String(), sa.ForeignKey("rubrics.id"), nullable=False),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("educator_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("criteria_met_json", sa.Text(), nullable=False),
        sa.Column("evidence_note", sa.Text(), nullable=False),
        sa.Column("passed", sa.Boolean(), nullable=False),
        sa.Column("signed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_rubric_signoffs_rubric_id", "rubric_signoffs", ["rubric_id"])
    op.create_index("ix_rubric_signoffs_learner_id", "rubric_signoffs", ["learner_id"])
    op.create_table(
        "formative_feedbacks",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("learner_id", sa.String(), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("lesson_id", sa.String(length=200), nullable=False),
        sa.Column("exercise_id", sa.String(length=200), nullable=False),
        sa.Column("submission_id", sa.String(), nullable=True),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("learner_response", sa.Text(), nullable=False),
        sa.Column("rubric_id", sa.String(), nullable=True),
        sa.Column("criteria_json", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=False),
        sa.Column("passed", sa.Boolean(), nullable=False),
        sa.Column("criterion_evaluations", sa.Text(), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("strengths", sa.Text(), nullable=False),
        sa.Column("actionable_guidance", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_formative_feedbacks_learner_id", "formative_feedbacks", ["learner_id"])
    op.create_index("ix_formative_feedbacks_lesson_id", "formative_feedbacks", ["lesson_id"])
    op.create_index("ix_formative_feedbacks_created_at", "formative_feedbacks", ["created_at"])


def downgrade() -> None:
    op.drop_table("formative_feedbacks")
    op.drop_table("rubric_signoffs")
    op.drop_table("rubrics")
    op.drop_column("learners", "role")
