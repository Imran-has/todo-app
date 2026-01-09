# AuthDatabaseAgent Skills

## Agent Info
- **Name:** AuthDatabaseAgent
- **Parent:** AuthAgent
- **Responsibility:** Manage user authentication data in database.

---

## Skills

### 1. SQLModel User Schema
```python
class User(SQLModel, table=True):
    id: int | None
    email: str
    password_hash: str
    created_at: datetime
    updated_at: datetime
```

### 2. Neon PostgreSQL Connection
- Connection string setup
- Connection pooling
- SSL configuration

### 3. User Table Migrations
- Create users table
- Add indexes
- Schema updates

### 4. Email Index
- Unique index on email
- Fast email lookup
- Duplicate prevention

### 5. Password Hash Storage
- Secure hash column
- No plain text storage
- Hash length handling

### 6. Timestamps
- `created_at` auto-set
- `updated_at` auto-update
- Timezone handling (UTC)
