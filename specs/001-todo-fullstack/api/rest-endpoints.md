# API Specification: REST Endpoints

**Feature Branch**: `001-todo-fullstack`
**Created**: 2025-12-24
**Status**: Draft

## Overview

This document specifies the REST API endpoints for the Todo Full-Stack Web Application. All endpoints follow RESTful conventions and return JSON responses.

## Authentication

All task-related endpoints require authentication via JWT token.

**Header Format**: `Authorization: Bearer <token>`

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Valid token but accessing another user's resources

## Base URLs

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:8000` |
| Production | `https://api.example.com` |

## Endpoints

### Task Operations

#### List All Tasks

Retrieve all tasks for the authenticated user.

| Property | Value |
|----------|-------|
| Method | GET |
| Path | `/api/{user_id}/tasks` |
| Auth Required | Yes |

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID. Must match the token's user.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | string | No | all | Filter by status: `all`, `pending`, `completed` |
| sort | string | No | created | Sort by: `created`, `title` |
| order | string | No | desc | Sort order: `asc`, `desc` |

**Success Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2025-12-24T10:00:00Z",
      "updated_at": "2025-12-24T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Error Responses**:
- 401: `{"detail": "Not authenticated"}`
- 403: `{"detail": "Access denied"}`

---

#### Create Task

Create a new task for the authenticated user.

| Property | Value |
|----------|-------|
| Method | POST |
| Path | `/api/{user_id}/tasks` |
| Auth Required | Yes |
| Content-Type | application/json |

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID. Must match the token's user.

**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-200 characters, non-empty after trimming |
| description | string | No | Max 1000 characters |

**Success Response** (201 Created):
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-24T10:00:00Z",
  "updated_at": "2025-12-24T10:00:00Z"
}
```

**Error Responses**:
- 400: `{"detail": "Title is required"}`
- 400: `{"detail": "Title must be between 1 and 200 characters"}`
- 400: `{"detail": "Description must not exceed 1000 characters"}`
- 401: `{"detail": "Not authenticated"}`
- 403: `{"detail": "Access denied"}`

---

#### Get Task Details

Retrieve a specific task by ID.

| Property | Value |
|----------|-------|
| Method | GET |
| Path | `/api/{user_id}/tasks/{task_id}` |
| Auth Required | Yes |

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID
- `task_id` (integer, required): The task's ID

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-24T10:00:00Z",
  "updated_at": "2025-12-24T10:00:00Z"
}
```

**Error Responses**:
- 401: `{"detail": "Not authenticated"}`
- 403: `{"detail": "Access denied"}`
- 404: `{"detail": "Task not found"}`

---

#### Update Task

Update an existing task's title and/or description.

| Property | Value |
|----------|-------|
| Method | PUT |
| Path | `/api/{user_id}/tasks/{task_id}` |
| Auth Required | Yes |
| Content-Type | application/json |

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID
- `task_id` (integer, required): The task's ID

**Request Body**:
```json
{
  "title": "Buy groceries and supplies",
  "description": "Milk, eggs, bread, paper towels"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-200 characters, non-empty after trimming |
| description | string | No | Max 1000 characters, null to clear |

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Buy groceries and supplies",
  "description": "Milk, eggs, bread, paper towels",
  "completed": false,
  "created_at": "2025-12-24T10:00:00Z",
  "updated_at": "2025-12-24T11:30:00Z"
}
```

**Error Responses**:
- 400: `{"detail": "Title is required"}`
- 400: `{"detail": "Title must be between 1 and 200 characters"}`
- 401: `{"detail": "Not authenticated"}`
- 403: `{"detail": "Access denied"}`
- 404: `{"detail": "Task not found"}`

---

#### Delete Task

Permanently delete a task.

| Property | Value |
|----------|-------|
| Method | DELETE |
| Path | `/api/{user_id}/tasks/{task_id}` |
| Auth Required | Yes |

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID
- `task_id` (integer, required): The task's ID

**Success Response** (204 No Content): Empty body

**Error Responses**:
- 401: `{"detail": "Not authenticated"}`
- 403: `{"detail": "Access denied"}`
- 404: `{"detail": "Task not found"}`

---

#### Toggle Task Completion

Toggle a task's completion status.

| Property | Value |
|----------|-------|
| Method | PATCH |
| Path | `/api/{user_id}/tasks/{task_id}/complete` |
| Auth Required | Yes |

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID
- `task_id` (integer, required): The task's ID

**Request Body**: None required. The endpoint toggles the current completion state.

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2025-12-24T10:00:00Z",
  "updated_at": "2025-12-24T12:00:00Z"
}
```

**Error Responses**:
- 401: `{"detail": "Not authenticated"}`
- 403: `{"detail": "Access denied"}`
- 404: `{"detail": "Task not found"}`

---

## Data Models

### Task Object

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique task identifier |
| title | string | Task title (1-200 chars) |
| description | string or null | Optional task description (max 1000 chars) |
| completed | boolean | Completion status |
| created_at | string (ISO 8601) | Creation timestamp |
| updated_at | string (ISO 8601) | Last update timestamp |

### Error Object

| Field | Type | Description |
|-------|------|-------------|
| detail | string | Human-readable error message |

## Security Considerations

1. **User Isolation**: All endpoints verify that the `user_id` in the path matches the authenticated user's ID from the JWT token
2. **Input Validation**: All input is validated before processing
3. **Rate Limiting**: Endpoints should be rate-limited to prevent abuse (implementation detail)
4. **CORS**: Only the frontend origin is allowed to make requests

## Assumptions

- All timestamps are in UTC and returned in ISO 8601 format
- Task IDs are auto-incrementing integers unique across the system
- User IDs are strings (UUIDs or similar) from the authentication provider
- The frontend handles token refresh before expiration
- Pagination is not required for Phase II (assumed <100 tasks per user)
