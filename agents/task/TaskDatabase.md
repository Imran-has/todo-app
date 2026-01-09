# TaskDatabaseAgent

## Agent Info
- **Name:** TaskDatabaseAgent
- **Type:** Sub-Agent
- **Parent:** TaskAgent
- **Layer:** Database

## Responsibility
Handle task data persistence and queries.

## Skills
- SQLModel Task schema design
- Foreign key to User table
- Neon PostgreSQL task queries
- Filtered queries by `user_id`
- Task table migrations
- Indexed queries on `user_id`
- Soft delete implementation
- Created/updated/completed timestamps

## Files to Create

```
backend/
├── app/
│   ├── models/
│   │   └── task.py
│   └── db/
│       └── migrations/
│           └── 002_create_tasks.py
```

## SQLModel Schema

```python
# models/task.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: str | None = None
    is_completed: bool = Field(default=False)

    # Foreign Key
    user_id: int = Field(foreign_key="users.id", index=True)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = None
    deleted_at: datetime | None = None  # Soft delete

    # Relationship
    user: "User" = Relationship(back_populates="tasks")
```

## Migration: Create Tasks Table

```sql
-- migrations/002_create_tasks.sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Index for fast user task lookup
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Index for filtering by completion status
CREATE INDEX idx_tasks_is_completed ON tasks(is_completed);
```

## Database Queries

```python
# Query: Get user tasks (exclude soft deleted)
def get_tasks_by_user(db: Session, user_id: int) -> list[Task]:
    return db.query(Task).filter(
        Task.user_id == user_id,
        Task.deleted_at.is_(None)
    ).order_by(Task.created_at.desc()).all()

# Query: Get completed tasks
def get_completed_tasks(db: Session, user_id: int) -> list[Task]:
    return db.query(Task).filter(
        Task.user_id == user_id,
        Task.is_completed == True,
        Task.deleted_at.is_(None)
    ).all()

# Query: Get pending tasks
def get_pending_tasks(db: Session, user_id: int) -> list[Task]:
    return db.query(Task).filter(
        Task.user_id == user_id,
        Task.is_completed == False,
        Task.deleted_at.is_(None)
    ).all()

# Soft delete
def soft_delete_task(db: Session, task: Task) -> None:
    task.deleted_at = datetime.utcnow()
    db.commit()

# Toggle complete
def toggle_task_complete(db: Session, task: Task) -> Task:
    task.is_completed = not task.is_completed
    task.completed_at = datetime.utcnow() if task.is_completed else None
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task
```

## User-Task Relationship

```python
# In models/user.py - add relationship
class User(SQLModel, table=True):
    # ... existing fields
    tasks: list["Task"] = Relationship(back_populates="user")
```

## Dependencies
- sqlmodel
- psycopg2-binary
