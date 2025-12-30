"""User model for authentication."""
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .task import Task


class User(SQLModel, table=True):
    """
    User account managed by Better Auth.

    Note: Better Auth may manage additional fields (password hash, etc.)
    This model represents the subset we interact with directly.
    """

    __tablename__ = "users"

    id: str = Field(primary_key=True, max_length=255)
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")
