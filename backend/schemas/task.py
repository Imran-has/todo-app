"""Pydantic schemas for Task request/response validation."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Request body for creating a task."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class TaskUpdate(BaseModel):
    """Request body for updating a task."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class TaskResponse(BaseModel):
    """Response body for a single task."""

    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Response body for task list."""

    tasks: List[TaskResponse]
    total: int


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
