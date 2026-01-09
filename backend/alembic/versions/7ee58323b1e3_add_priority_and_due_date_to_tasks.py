"""Add priority and due_date to tasks

Revision ID: 7ee58323b1e3
Revises: 001
Create Date: 2026-01-07 10:12:10.359514

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7ee58323b1e3'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add priority column with default value for existing rows
    op.add_column('tasks', sa.Column('priority', sa.String(length=10), nullable=True))

    # Set default value for existing rows
    op.execute("UPDATE tasks SET priority = 'medium' WHERE priority IS NULL")

    # Now make it NOT NULL
    op.alter_column('tasks', 'priority', nullable=False, server_default='medium')

    # Add due_date column (nullable, no default needed)
    op.add_column('tasks', sa.Column('due_date', sa.Date(), nullable=True))


def downgrade() -> None:
    op.drop_column('tasks', 'due_date')
    op.drop_column('tasks', 'priority')
