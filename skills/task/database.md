# TaskDatabaseAgent Skills

## Agent Info
- **Name:** TaskDatabaseAgent
- **Parent:** TaskAgent
- **Responsibility:** Handle task data persistence and queries.

---

## Skills

### 1. SQLModel Task Schema
```python
class Task(SQLModel, table=True):
    id: int | None
    title: str
    description: str | None
    is_completed: bool = False
    user_id: int  # Foreign Key
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None  # Soft delete
```

### 2. Foreign Key Relationship
- `user_id` references `users.id`
- ON DELETE CASCADE
- Relationship definition

### 3. Neon PostgreSQL Queries
- INSERT task
- SELECT tasks by user
- UPDATE task
- DELETE task (soft)

### 4. Filtered Queries
- Filter by `user_id`
- Filter by `is_completed`
- Exclude soft deleted

### 5. Task Table Migrations
- Create tasks table
- Add foreign key
- Add indexes

### 6. Index on user_id
- Fast user task lookup
- Query optimization

### 7. Soft Delete
- `deleted_at` timestamp
- Filter out deleted
- Restore capability

### 8. Timestamps
- `created_at` - task creation
- `updated_at` - last modification
- `deleted_at` - soft delete time
- `completed_at` - completion time (optional)
