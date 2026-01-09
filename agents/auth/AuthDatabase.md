# AuthDatabaseAgent

## Agent Info
- **Name:** AuthDatabaseAgent
- **Type:** Sub-Agent
- **Parent:** AuthAgent
- **Layer:** Database

## Responsibility
Manage user authentication data in database.

## Skills
- SQLModel User schema design
- Neon PostgreSQL connection pooling
- User table migrations
- Indexed queries on email field
- Password hash storage
- Created/updated timestamps

## Files to Create

```
backend/
├── app/
│   ├── db/
│   │   ├── __init__.py
│   │   ├── connection.py
│   │   └── migrations/
│   │       └── 001_create_users.py
│   └── models/
│       └── user.py
```

## SQLModel Schema

```python
# models/user.py
from sqlmodel import SQLModel, Field
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str | None = None
    password_hash: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Database Connection

```python
# db/connection.py
from sqlmodel import create_engine, Session
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_size=5,
    max_overflow=10
)

def get_db():
    with Session(engine) as session:
        yield session
```

## Migration: Create Users Table

```sql
-- migrations/001_create_users.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

## Database Operations

```python
# CRUD operations
def create_user(db: Session, user: UserCreate, password_hash: str) -> User:
    db_user = User(
        email=user.email,
        name=user.name,
        password_hash=password_hash
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)
```

## Neon PostgreSQL Config

```python
# .env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/tododb?sslmode=require
```

## Dependencies
- sqlmodel
- psycopg2-binary
- asyncpg (for async)
