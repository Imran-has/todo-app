# UserDatabaseAgent

## Agent Info
- **Name:** UserDatabaseAgent
- **Type:** Sub-Agent
- **Parent:** UserAgent
- **Layer:** Database

## Responsibility
Manage user data in database.

## Skills
- SQLModel User schema
- Neon PostgreSQL user queries
- User lookup by ID/email
- User-Task relationship definition
- Database connection management

## Files to Create

```
backend/
├── app/
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   └── db/
│       └── connection.py
```

## SQLModel Schema

```python
# models/user.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from .task import Task

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    name: str | None = Field(default=None, max_length=255)
    password_hash: str = Field(max_length=255)
    is_active: bool = Field(default=True)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: List["Task"] = Relationship(back_populates="user")
```

## Database Connection

```python
# db/connection.py
from sqlmodel import create_engine, Session, SQLModel
from app.core.config import settings

# Neon PostgreSQL connection
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

def init_db():
    """Create all tables."""
    SQLModel.metadata.create_all(engine)

def get_db():
    """Database session dependency."""
    with Session(engine) as session:
        yield session
```

## Database Queries

```python
# User queries
from sqlmodel import Session, select
from app.models.user import User

def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Get user by primary key."""
    return db.get(User, user_id)

def get_user_by_email(db: Session, email: str) -> User | None:
    """Get user by email (for login)."""
    statement = select(User).where(User.email == email)
    return db.exec(statement).first()

def get_user_with_tasks(db: Session, user_id: int) -> User | None:
    """Get user with their tasks loaded."""
    user = db.get(User, user_id)
    if user:
        _ = user.tasks  # Load relationship
    return user
```

## User-Task Relationship

```
┌──────────────┐         ┌──────────────┐
│    users     │         │    tasks     │
├──────────────┤         ├──────────────┤
│ id (PK)      │◄────────│ user_id (FK) │
│ email        │         │ id (PK)      │
│ name         │         │ title        │
│ password_hash│         │ description  │
│ is_active    │         │ is_completed │
│ created_at   │         │ created_at   │
│ updated_at   │         │ updated_at   │
└──────────────┘         └──────────────┘
       │                        │
       │    One-to-Many         │
       └────────────────────────┘
```

## Environment Config

```python
# core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    DEBUG: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

## .env Example

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/tododb?sslmode=require
SECRET_KEY=your-secret-key-here
DEBUG=true
```

## Dependencies
- sqlmodel
- psycopg2-binary
- pydantic-settings
