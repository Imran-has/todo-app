# Data Model: Todo Full-Stack Web Application

**Branch**: `001-todo-fullstack`
**Date**: 2025-12-24
**Status**: Complete

## Overview

This document defines the data models for the Todo Full-Stack Web Application, covering both backend (SQLModel/Python) and frontend (TypeScript) representations.

---

## Entity Relationship Diagram

```
┌─────────────────────────┐         ┌─────────────────────────┐
│         User            │         │         Task            │
│─────────────────────────│         │─────────────────────────│
│ id: str (PK)            │ 1    *  │ id: int (PK)            │
│ email: str (unique)     │─────────│ user_id: str (FK)       │
│ name: str               │         │ title: str              │
│ created_at: datetime    │         │ description: str | null │
│                         │         │ completed: bool         │
│                         │         │ created_at: datetime    │
│                         │         │ updated_at: datetime    │
└─────────────────────────┘         └─────────────────────────┘
```

---

## Backend Models (SQLModel/Python)

### User Model

```python
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

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

    # Relationship
    tasks: List["Task"] = Relationship(back_populates="user")
```

### Task Model

```python
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Task(SQLModel, table=True):
    """
    A task belonging to a user.
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, max_length=255)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: Optional["User"] = Relationship(back_populates="tasks")
```

---

## API Request/Response Schemas (Pydantic)

### Task Schemas

```python
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
```

### Error Schema

```python
class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
```

---

## Frontend Types (TypeScript)

### Task Types

```typescript
// Task entity
interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

// Request to create a task
interface CreateTaskRequest {
  title: string;
  description?: string;
}

// Request to update a task
interface UpdateTaskRequest {
  title: string;
  description?: string | null;
}

// Response for task list
interface TaskListResponse {
  tasks: Task[];
  total: number;
}

// Query parameters for filtering/sorting
interface TaskQueryParams {
  status?: 'all' | 'pending' | 'completed';
  sort?: 'created' | 'title';
  order?: 'asc' | 'desc';
}
```

### User Types

```typescript
// User entity (from auth)
interface User {
  id: string;
  email: string;
  name: string;
}

// Auth session
interface Session {
  user: User;
  token: string;
  expiresAt: string;
}
```

### Error Types

```typescript
// API error response
interface ApiError {
  detail: string;
}

// Typed error for client handling
class ApiRequestError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail);
  }
}
```

---

## Validation Rules

### Task Title
| Rule | Value | Enforcement |
|------|-------|-------------|
| Required | Yes | Pydantic, Database NOT NULL |
| Min Length | 1 character | Pydantic validator |
| Max Length | 200 characters | Pydantic, Database VARCHAR(200) |
| Trim whitespace | Yes | Application layer |

### Task Description
| Rule | Value | Enforcement |
|------|-------|-------------|
| Required | No | Pydantic Optional |
| Max Length | 1000 characters | Pydantic validator |
| Null allowed | Yes | Database NULL |

### User ID
| Rule | Value | Enforcement |
|------|-------|-------------|
| Format | String (UUID-like) | From Better Auth |
| Max Length | 255 characters | Database VARCHAR(255) |
| Immutable | Yes | Not exposed in update APIs |

---

## State Transitions

### Task Completion State

```
┌──────────┐       toggle        ┌──────────┐
│ Pending  │ ◄──────────────────►│ Complete │
│(completed│                     │(completed│
│ = false) │                     │ = true)  │
└──────────┘                     └──────────┘
```

- Initial state: `completed = false`
- Toggle operation flips the value
- No other states exist

### Task Lifecycle

```
┌────────┐   create   ┌────────┐   update   ┌────────┐   delete   ┌─────────┐
│  New   │ ──────────►│ Active │ ──────────►│ Active │ ──────────►│ Deleted │
│        │            │        │ (modified) │        │            │(removed)│
└────────┘            └────────┘            └────────┘            └─────────┘
                            │
                            │ toggle
                            ▼
                      ┌──────────┐
                      │Completed │
                      │          │
                      └──────────┘
```

---

## Indexes and Query Optimization

### Primary Queries

| Query Pattern | Index Used |
|--------------|------------|
| Get all tasks for user | `idx_tasks_user_id` |
| Get pending tasks for user | `idx_tasks_user_completed` |
| Get completed tasks for user | `idx_tasks_user_completed` |
| Sort by created_at | `idx_tasks_created_at` |

### Query Examples

```sql
-- List all tasks for user (sorted by created_at desc)
SELECT * FROM tasks
WHERE user_id = :user_id
ORDER BY created_at DESC;

-- List pending tasks for user
SELECT * FROM tasks
WHERE user_id = :user_id AND completed = false
ORDER BY created_at DESC;

-- Get single task (with ownership check)
SELECT * FROM tasks
WHERE id = :task_id AND user_id = :user_id;
```

---

## Data Integrity Constraints

| Constraint | Type | Description |
|------------|------|-------------|
| PK users | Primary Key | `users.id` must be unique |
| PK tasks | Primary Key | `tasks.id` auto-incrementing |
| FK tasks.user_id | Foreign Key | References `users.id` |
| UQ users.email | Unique | No duplicate emails |
| CK title_length | Check | `LENGTH(title) BETWEEN 1 AND 200` |
| NN required fields | Not Null | See model definitions |

---

## Migration Considerations

### Initial Schema (v1)

Order of operations:
1. Create `users` table
2. Create `tasks` table with FK to users
3. Create indexes

### Future Migrations (Out of Scope for Phase II)

- Add `due_date` column to tasks
- Add `priority` column to tasks
- Add `tags` many-to-many relationship
- Add soft delete (`deleted_at` column)
