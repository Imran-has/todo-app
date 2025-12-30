# UserBackendAgent

## Agent Info
- **Name:** UserBackendAgent
- **Type:** Sub-Agent
- **Parent:** UserAgent
- **Layer:** Backend

## Responsibility
Handle user data operations via API.

## Skills
- FastAPI user router (`/api/users/me`)
- Pydantic UserResponse schema
- Current user extraction from JWT
- User profile endpoint
- SQLModel user queries
- User validation utilities

## Files to Create

```
backend/
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── __init__.py
│   │       └── router.py
│   ├── schemas/
│   │   └── user.py
│   └── crud/
│       └── user.py
```

## API Endpoints

### GET /api/users/me
```python
@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user profile."""
    return current_user
```

## Pydantic Schemas

```python
# schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserResponse(BaseModel):
    id: int
    email: str
    name: str | None
    created_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: str | None = None
```

## CRUD Functions

```python
# crud/user.py
from sqlmodel import Session
from app.models.user import User

def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Get user by ID."""
    return db.get(User, user_id)

def get_user_by_email(db: Session, email: str) -> User | None:
    """Get user by email."""
    return db.query(User).filter(User.email == email).first()

def user_exists(db: Session, email: str) -> bool:
    """Check if user exists."""
    return get_user_by_email(db, email) is not None

def is_active_user(user: User) -> bool:
    """Check if user is active."""
    return user.is_active
```

## Router Setup

```python
# api/users/router.py
from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user
from app.schemas.user import UserResponse
from app.models.user import User

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

## Dependencies
- fastapi
- sqlmodel
- pydantic
