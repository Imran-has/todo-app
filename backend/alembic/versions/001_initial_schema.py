"""Initial schema with users and tasks tables.

Revision ID: 001
Revises:
Create Date: 2025-12-24

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.String(length=255), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('length(title) >= 1 AND length(title) <= 200', name='chk_title_length')
    )

    # Create indexes for tasks
    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('idx_tasks_completed', 'tasks', ['completed'])
    op.create_index('idx_tasks_user_completed', 'tasks', ['user_id', 'completed'])
    op.create_index('idx_tasks_created_at', 'tasks', ['created_at'])


def downgrade() -> None:
    # Drop tasks table and its indexes
    op.drop_index('idx_tasks_created_at', table_name='tasks')
    op.drop_index('idx_tasks_user_completed', table_name='tasks')
    op.drop_index('idx_tasks_completed', table_name='tasks')
    op.drop_index('idx_tasks_user_id', table_name='tasks')
    op.drop_table('tasks')

    # Drop users table and its indexes
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
