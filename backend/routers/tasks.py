"""Task CRUD endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func

from database import get_session
from models import Task, User
from schemas import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from middleware import verify_user_access, AuthenticatedUser

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])


async def get_or_create_user(
    session: AsyncSession,
    current_user: AuthenticatedUser,
) -> User:
    """Get existing user or create if not exists."""
    result = await session.execute(
        select(User).where(User.id == current_user.user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            id=current_user.user_id,
            email=current_user.email,
            name=current_user.name,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)

    return user


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    current_user: AuthenticatedUser = Depends(verify_user_access),
    session: AsyncSession = Depends(get_session),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    sort: str = Query("created_at", description="Sort field"),
    order: str = Query("desc", description="Sort order (asc/desc)"),
) -> TaskListResponse:
    """List all tasks for the authenticated user."""
    await get_or_create_user(session, current_user)

    query = select(Task).where(Task.user_id == current_user.user_id)

    # Apply completion filter
    if completed is not None:
        query = query.where(Task.completed == completed)

    # Apply sorting
    sort_column = getattr(Task, sort, Task.created_at)
    if order.lower() == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    result = await session.execute(query)
    tasks = result.scalars().all()

    # Get total count
    count_query = select(func.count(Task.id)).where(Task.user_id == current_user.user_id)
    if completed is not None:
        count_query = count_query.where(Task.completed == completed)
    count_result = await session.execute(count_query)
    total = count_result.scalar_one()

    return TaskListResponse(
        tasks=[TaskResponse.model_validate(t) for t in tasks],
        total=total,
    )


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    current_user: AuthenticatedUser = Depends(verify_user_access),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Create a new task."""
    await get_or_create_user(session, current_user)

    task = Task(
        user_id=current_user.user_id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)

    return TaskResponse.model_validate(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: AuthenticatedUser = Depends(verify_user_access),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Get a specific task by ID."""
    result = await session.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.user_id,
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: AuthenticatedUser = Depends(verify_user_access),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Update a task."""
    result = await session.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.user_id,
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.title = task_data.title
    task.description = task_data.description
    task.priority = task_data.priority
    task.due_date = task_data.due_date
    task.touch()  # Update updated_at

    await session.commit()
    await session.refresh(task)

    return TaskResponse.model_validate(task)


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: int,
    current_user: AuthenticatedUser = Depends(verify_user_access),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Mark a task as complete."""
    result = await session.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.user_id,
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = True
    task.touch()

    await session.commit()
    await session.refresh(task)

    return TaskResponse.model_validate(task)


@router.patch("/{task_id}/incomplete", response_model=TaskResponse)
async def incomplete_task(
    task_id: int,
    current_user: AuthenticatedUser = Depends(verify_user_access),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Mark a task as incomplete."""
    result = await session.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.user_id,
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = False
    task.touch()

    await session.commit()
    await session.refresh(task)

    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    current_user: AuthenticatedUser = Depends(verify_user_access),
    session: AsyncSession = Depends(get_session),
) -> None:
    """Delete a task."""
    result = await session.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.user_id,
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await session.delete(task)
    await session.commit()
