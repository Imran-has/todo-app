# UserDatabaseAgent Skills

## Agent Info
- **Name:** UserDatabaseAgent
- **Parent:** UserAgent
- **Responsibility:** Manage user data in database.

---

## Skills

### 1. SQLModel User Schema
```python
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str | None = None
    password_hash: str
    created_at: datetime
    updated_at: datetime
```

### 2. Neon PostgreSQL Queries
- User lookup by ID
- User lookup by email
- Connection management

### 3. User-Task Relationship
```python
class User(SQLModel, table=True):
    # ... fields
    tasks: list["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    # ... fields
    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="tasks")
```

### 4. Database Connection
- Neon connection string
- SQLModel engine setup
- Session management
- Connection pooling
