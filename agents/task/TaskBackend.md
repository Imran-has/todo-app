# TaskBackendAgent

## Agent Info
- **Name:** TaskBackendAgent
- **Type:** Sub-Agent
- **Parent:** TaskAgent
- **Layer:** Backend

## Responsibility
Process task API requests with database operations.

## Skills
- FastAPI task router (`/api/tasks`)
- Pydantic TaskCreate/TaskUpdate schemas
- FastAPI path operations (GET, POST, PUT, DELETE)
- JWT user extraction from headers
- SQLModel Task CRUD functions
- User ownership validation middleware
- Response model serialization
- Error handling with HTTPException

## Files to Create

```
backend/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── __init__.py
│   │       └── router.py
│   ├── models/
│   │   └── task.py
│   ├── schemas/
│   │   └── task.py
│   └── crud/
│       └── task.py
```

## API Endpoints

### GET /api/tasks
```python
@router.get("/", response_model=list[TaskResponse])
async def get_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all tasks for current user
    return crud.get_tasks_by_user(db, current_user.id)
```

### POST /api/tasks
```python
@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create task with user_id
    return crud.create_task(db, task_data, current_user.id)
```

### GET /api/tasks/{task_id}
```python
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(403, "Not authorized")
    return task
```

### PUT /api/tasks/{task_id}
```python
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(403, "Not authorized")
    return crud.update_task(db, task, task_data)
```

### DELETE /api/tasks/{task_id}
```python
@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(403, "Not authorized")
    crud.delete_task(db, task)
```

## Pydantic Schemas

```python
# schemas/task.py
from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: str | None = None

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_completed: bool | None = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    is_completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

## CRUD Functions

```python
# crud/task.py
def get_tasks_by_user(db: Session, user_id: int) -> list[Task]:
    return db.query(Task).filter(Task.user_id == user_id).all()

def get_task(db: Session, task_id: int) -> Task | None:
    return db.get(Task, task_id)

def create_task(db: Session, data: TaskCreate, user_id: int) -> Task:
    task = Task(**data.model_dump(), user_id=user_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def update_task(db: Session, task: Task, data: TaskUpdate) -> Task:
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
```

## Dependencies
- fastapi
- sqlmodel
- pydantic
