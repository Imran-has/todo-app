# UserBackendAgent Skills

## Agent Info
- **Name:** UserBackendAgent
- **Parent:** UserAgent
- **Responsibility:** Handle user data operations via API.

---

## Skills

### 1. FastAPI User Router
- `GET /api/users/me` - Current user profile
- Router prefix setup
- Tags for docs

### 2. Pydantic Schemas
```python
class UserResponse(BaseModel):
    id: int
    email: str
    name: str | None
    created_at: datetime
```

### 3. Current User Extraction
- Depends on `get_current_user`
- JWT token parsing
- User ID from payload

### 4. User Profile Endpoint
- Return current user data
- Exclude password hash
- Include timestamps

### 5. SQLModel User Queries
- Find user by ID
- User exists check

### 6. User Validation Utilities
- Email format validation
- User existence check
- Active user check
