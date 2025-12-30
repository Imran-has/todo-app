# TaskBackendAgent Skills

## Agent Info
- **Name:** TaskBackendAgent
- **Parent:** TaskAgent
- **Responsibility:** Process task API requests with database operations.

---

## Skills

### 1. FastAPI Task Router
- `GET /api/tasks` - List user tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/{id}` - Get single task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### 2. Pydantic Schemas
```python
class TaskCreate(BaseModel):
    title: str
    description: str | None

class TaskUpdate(BaseModel):
    title: str | None
    description: str | None
    is_completed: bool | None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    is_completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime
```

### 3. FastAPI Path Operations
- GET with query params
- POST with request body
- PUT with partial update
- DELETE with path param

### 4. JWT User Extraction
- Extract token from header
- Decode JWT payload
- Get user_id from token

### 5. SQLModel CRUD Functions
- `create_task()`
- `get_tasks_by_user()`
- `get_task_by_id()`
- `update_task()`
- `delete_task()`

### 6. Ownership Validation
- Check task belongs to user
- 403 Forbidden if not owner
- Middleware implementation

### 7. Response Serialization
- TaskResponse model
- List[TaskResponse] for lists
- Proper JSON formatting

### 8. Error Handling
- `HTTPException(404)` - Not found
- `HTTPException(403)` - Forbidden
- `HTTPException(400)` - Bad request
- `HTTPException(401)` - Unauthorized
