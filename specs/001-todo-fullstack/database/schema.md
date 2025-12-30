# Database Specification: Schema Design

**Feature Branch**: `001-todo-fullstack`
**Created**: 2025-12-24
**Status**: Draft

## Overview

This document specifies the database schema for the Todo Full-Stack Web Application. The schema is designed to support multi-user task management with proper data isolation and referential integrity.

## Entity Relationship

```
┌─────────────┐         ┌─────────────┐
│   users     │ 1     * │   tasks     │
│─────────────│─────────│─────────────│
│ id (PK)     │         │ id (PK)     │
│ email       │         │ user_id (FK)│
│ name        │         │ title       │
│ created_at  │         │ description │
│             │         │ completed   │
│             │         │ created_at  │
│             │         │ updated_at  │
└─────────────┘         └─────────────┘
```

**Relationship**: One user has many tasks. Each task belongs to exactly one user.

## Tables

### users

Stores registered user accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY | Unique user identifier (from auth provider) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| name | VARCHAR(100) | NOT NULL | User's display name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |

**Notes**:
- The `id` is a string to accommodate UUIDs or IDs from external authentication providers
- Email is used for login and must be unique across the system
- Name is used for display purposes in the UI

---

### tasks

Stores user tasks with ownership and completion tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing task identifier |
| user_id | VARCHAR(255) | FOREIGN KEY → users.id, NOT NULL | Owner of the task |
| title | VARCHAR(200) | NOT NULL | Task title (1-200 characters) |
| description | TEXT | NULL | Optional task description (max 1000 chars) |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification timestamp |

**Notes**:
- Task ownership is immutable - tasks cannot be transferred between users
- Description length validation (1000 chars) is enforced at the application level
- `updated_at` is automatically updated on any modification

---

## Indexes

Performance indexes to optimize common query patterns:

| Table | Index Name | Columns | Purpose |
|-------|------------|---------|---------|
| tasks | idx_tasks_user_id | user_id | Fast lookup of all tasks by user |
| tasks | idx_tasks_completed | completed | Support filtering by completion status |
| tasks | idx_tasks_user_completed | user_id, completed | Compound index for filtered user queries |
| tasks | idx_tasks_created_at | created_at | Support sorting by creation date |

---

## Constraints

### Foreign Key Constraints

| Constraint | Table | Column | References | On Delete |
|------------|-------|--------|------------|-----------|
| fk_tasks_user | tasks | user_id | users.id | CASCADE |

**On Delete Behavior**: When a user is deleted, all their tasks are automatically deleted (CASCADE). This ensures no orphaned tasks remain in the system.

### Check Constraints

| Constraint | Table | Column | Rule |
|------------|-------|--------|------|
| chk_title_length | tasks | title | LENGTH(title) >= 1 AND LENGTH(title) <= 200 |

**Note**: Description length constraint (max 1000) is enforced at the application layer for better error messaging.

---

## Data Integrity Rules

1. **User Isolation**: Tasks are always filtered by `user_id` in application queries
2. **Referential Integrity**: Foreign key ensures tasks cannot reference non-existent users
3. **Cascading Deletes**: User deletion removes all associated tasks
4. **Required Fields**: `id`, `user_id`, `title`, `created_at`, `updated_at` are never null
5. **Default Values**: `completed` defaults to `false`, timestamps default to current time

---

## Timestamp Handling

All timestamps are stored and returned in UTC:

| Field | Behavior |
|-------|----------|
| created_at | Set automatically on INSERT, never modified |
| updated_at | Set automatically on INSERT and UPDATE |

**Implementation Note**: Use database triggers or ORM hooks to automatically update `updated_at` on modifications.

---

## Migration Strategy

Migrations should be versioned and reversible:

1. **Version Naming**: `YYYYMMDD_HHMMSS_description.sql`
2. **Up Migration**: Creates/modifies schema
3. **Down Migration**: Reverts changes (rollback support)
4. **Order**: Users table must be created before tasks table (foreign key dependency)

### Initial Migration Order

1. Create `users` table
2. Create `tasks` table with foreign key to users
3. Create indexes on `tasks`

---

## Sample Data (Development Only)

For development and testing purposes:

**Users**:
| id | email | name | created_at |
|----|-------|------|------------|
| user_001 | alice@example.com | Alice Smith | 2025-12-24 10:00:00 |
| user_002 | bob@example.com | Bob Jones | 2025-12-24 10:05:00 |

**Tasks**:
| id | user_id | title | description | completed | created_at | updated_at |
|----|---------|-------|-------------|-----------|------------|------------|
| 1 | user_001 | Buy groceries | Milk, eggs, bread | false | 2025-12-24 10:10:00 | 2025-12-24 10:10:00 |
| 2 | user_001 | Finish report | Q4 summary | true | 2025-12-24 10:15:00 | 2025-12-24 11:00:00 |
| 3 | user_002 | Call dentist | Schedule checkup | false | 2025-12-24 10:20:00 | 2025-12-24 10:20:00 |

---

## Assumptions

- User IDs are provided by the authentication system (Better Auth) and are stable strings
- The database supports standard SQL features (PostgreSQL/Neon)
- Connection pooling is handled by the ORM/database driver
- No soft deletes - tasks are permanently removed when deleted
- No archival strategy needed for Phase II
- Audit logging is out of scope for Phase II
