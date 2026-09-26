"""auth challenges and learner email verified

Revision ID: 0003_auth_challenges
Revises: 0002_studio_ops
Create Date: 2026-09-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0003_auth_challenges"
down_revision: Union[str, None] = "0002_studio_ops"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "learners",
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_table(
        "auth_challenges",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("learner_id", sa.String(), nullable=False),
        sa.Column("purpose", sa.String(length=40), nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_auth_challenges_learner_id", "auth_challenges", ["learner_id"])
    op.create_index("uq_auth_challenges_token_hash", "auth_challenges", ["token_hash"], unique=True)


def downgrade() -> None:
    op.drop_table("auth_challenges")
    op.drop_column("learners", "email_verified")
