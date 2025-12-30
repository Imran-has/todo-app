# Implementation Plan: Todo Full-Stack Web Application

**Branch**: `001-todo-fullstack` | **Date**: 2025-12-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-fullstack/spec.md`

## Summary

Transform the console-based Todo application into a modern, multi-user web application with:
- **Frontend**: Next.js 16+ with TypeScript, Tailwind CSS, and Better Auth for authentication
- **Backend**: Python FastAPI with SQLModel ORM and JWT-based authorization
- **Database**: Neon Serverless PostgreSQL with proper indexes and constraints
- **Security**: JWT tokens for all API requests, strict user data isolation

Primary features: Task CRUD operations, user authentication, task filtering and sorting.

---

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Next.js 16+, Tailwind CSS, Better Auth
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Vitest (frontend)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Task list loads <2 seconds for 100 tasks, API responses <500ms
**Constraints**: JWT token expiry 7 days, title 1-200 chars, description max 1000 chars
**Scale/Scope**: Multi-user, <100 tasks per user typical, serverless deployment

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation |
|-----------|--------|----------------|
| I. Security-First Authentication | ✅ PASS | JWT required on all endpoints, 401/403 responses |
| II. API Contract Discipline | ✅ PASS | RESTful patterns, OpenAPI documented, consistent errors |
| III. Database Integrity | ✅ PASS | FK constraints, indexes, field validation |
| IV. Test-First Development | ✅ PASS | pytest for backend, Vitest for frontend |
| V. User Data Isolation | ✅ PASS | All queries filter by user_id, URL verification |
| VI. Simplicity & YAGNI | ✅ PASS | Minimal viable features, no premature optimization |

**Technology Stack Compliance**:
- ✅ Next.js 16+ with TypeScript
- ✅ Tailwind CSS
- ✅ Python FastAPI
- ✅ SQLModel ORM
- ✅ Neon PostgreSQL
- ✅ Better Auth with JWT
- ✅ REST + JSON API format

**All gates pass. Proceeding with implementation.**

---

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-fullstack/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Developer setup guide
├── contracts/
│   └── openapi.yaml     # API contract
├── features/
│   ├── task-crud.md     # Task management spec
│   └── authentication.md # Auth spec
├── api/
│   └── rest-endpoints.md # Endpoint details
├── database/
│   └── schema.md        # Database schema
└── checklists/
    └── requirements.md  # Validation checklist
```

### Source Code (repository root)

```text
backend/
├── main.py                  # FastAPI app entry point
├── config.py                # Environment configuration
├── models/
│   ├── __init__.py
│   ├── user.py              # User SQLModel
│   └── task.py              # Task SQLModel
├── schemas/
│   ├── __init__.py
│   └── task.py              # Pydantic request/response schemas
├── routers/
│   ├── __init__.py
│   ├── tasks.py             # Task CRUD endpoints
│   └── health.py            # Health check endpoint
├── services/
│   ├── __init__.py
│   └── task_service.py      # Task business logic
├── middleware/
│   ├── __init__.py
│   └── auth.py              # JWT authentication middleware
├── database.py              # Database connection setup
├── alembic/                 # Database migrations
│   ├── versions/
│   └── env.py
├── tests/
│   ├── conftest.py          # Test fixtures
│   ├── test_tasks.py        # Task endpoint tests
│   └── test_auth.py         # Auth middleware tests
└── requirements.txt         # Python dependencies

frontend/
├── app/
│   ├── layout.tsx           # Root layout (Server Component)
│   ├── page.tsx             # Home redirect
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx     # Login page (Client Component)
│   │   └── signup/
│   │       └── page.tsx     # Signup page (Client Component)
│   └── (protected)/
│       ├── layout.tsx       # Protected layout with auth check
│       └── tasks/
│           ├── page.tsx     # Task list (Server Component)
│           └── [id]/
│               └── page.tsx # Task detail (Server Component)
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx     # Task list component
│   │   ├── TaskItem.tsx     # Single task component
│   │   └── TaskForm.tsx     # Create/edit task form
│   ├── auth/
│   │   ├── LoginForm.tsx    # Login form
│   │   └── SignupForm.tsx   # Signup form
│   └── layout/
│       ├── Header.tsx       # App header with user info
│       └── Footer.tsx       # App footer
├── lib/
│   ├── api.ts               # API client with auth
│   ├── auth.ts              # Better Auth configuration
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
├── tests/
│   └── components/          # Component tests
├── tailwind.config.js       # Tailwind configuration
├── next.config.js           # Next.js configuration
└── package.json             # Node dependencies

docker-compose.yml           # Docker development setup
.env.example                 # Environment template
```

**Structure Decision**: Web application structure with separate `backend/` and `frontend/` directories. This matches the technology stack (FastAPI + Next.js) and allows independent deployment.

---

## Implementation Phases

### Phase 1: Backend Foundation

#### 1.1 Project Initialization
- Initialize FastAPI project structure
- Configure `requirements.txt` with dependencies:
  - `fastapi`, `uvicorn[standard]`
  - `sqlmodel`, `asyncpg`, `alembic`
  - `python-jose[cryptography]`
  - `python-dotenv`
  - `pytest`, `httpx`, `pytest-asyncio`
- Create `config.py` for environment variables

#### 1.2 Database Setup
- Configure async database connection to Neon PostgreSQL
- Create SQLModel models: `User`, `Task`
- Set up Alembic for migrations
- Create initial migration with:
  - `users` table
  - `tasks` table with FK to users
  - Required indexes

#### 1.3 Authentication Middleware
- Implement JWT verification dependency
- Extract user_id from token claims
- Verify user_id matches URL path parameter
- Return 401 for invalid/missing tokens
- Return 403 for user mismatch

#### 1.4 Task API Endpoints
- `GET /api/{user_id}/tasks` - List tasks with filters
- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks/{task_id}` - Get task detail
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion

#### 1.5 CORS Configuration
- Configure CORS middleware for frontend origin
- Allow credentials for cookie-based auth
- Restrict to specific HTTP methods

---

### Phase 2: Frontend Foundation

#### 2.1 Project Initialization
- Initialize Next.js 16+ with TypeScript
- Configure Tailwind CSS
- Set up Better Auth integration
- Create environment configuration

#### 2.2 Authentication Pages
- `/login` - Login form with email/password
- `/signup` - Registration form
- Better Auth session management
- JWT token handling

#### 2.3 API Client
- Create `lib/api.ts` with typed methods
- Automatic JWT attachment to requests
- Error handling and 401 redirect
- Type-safe request/response handling

#### 2.4 Protected Layout
- Auth check on protected routes
- Redirect to login if unauthenticated
- User info in header

---

### Phase 3: Task UI Implementation

#### 3.1 Task List Page
- Server Component for initial data fetch
- Display all user's tasks
- Empty state for new users
- Filter controls (all, pending, completed)
- Sort controls (created, title)

#### 3.2 Task Components
- `TaskItem` - Individual task display
  - Title and description
  - Completion checkbox
  - Edit and delete buttons
- `TaskForm` - Create/edit task
  - Title input (required)
  - Description textarea (optional)
  - Validation display

#### 3.3 Task Operations
- Create task with optimistic update
- Toggle completion with immediate feedback
- Edit task inline or modal
- Delete with confirmation

---

### Phase 4: Testing & Polish

#### 4.1 Backend Tests
- Authentication middleware tests
- Task CRUD endpoint tests
- User isolation tests (cross-user access denied)
- Validation error tests

#### 4.2 Frontend Tests
- Component unit tests
- Form validation tests
- API client mock tests

#### 4.3 Integration Testing
- End-to-end user flows
- Multi-user scenarios
- Error handling verification

#### 4.4 UI Polish
- Responsive design verification
- Loading states
- Error messages
- Success feedback

---

## Key Design Decisions

### Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │  Better Auth │     │   Backend    │
│   (Next.js)  │     │              │     │  (FastAPI)   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │  1. Login Request  │                    │
       │───────────────────►│                    │
       │                    │                    │
       │  2. JWT Token      │                    │
       │◄───────────────────│                    │
       │                    │                    │
       │  3. API Request + JWT                   │
       │─────────────────────────────────────────►
       │                    │                    │
       │                    │  4. Verify Token   │
       │                    │    Extract user_id │
       │                    │    Check URL match │
       │                    │                    │
       │  5. Response or Error                   │
       │◄─────────────────────────────────────────
```

### User Isolation Pattern

All task queries include user_id filter:
```python
# Every task query pattern
SELECT * FROM tasks WHERE user_id = :authenticated_user_id AND ...
```

URL verification in middleware:
```python
if token_user_id != path_user_id:
    raise HTTPException(status_code=403, detail="Access denied")
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| JWT secret mismatch | Medium | High | Document shared secret requirement |
| Database connection limits | Low | Medium | Use connection pooling |
| Token expiry UX | Medium | Low | Frontend handles refresh |
| Cross-user data leak | Low | Critical | Multiple test layers |

---

## Artifacts Generated

| Artifact | Path | Description |
|----------|------|-------------|
| Research | `research.md` | Technology decisions |
| Data Model | `data-model.md` | Entity definitions |
| API Contract | `contracts/openapi.yaml` | OpenAPI 3.1 spec |
| Quickstart | `quickstart.md` | Developer setup guide |

---

## Next Steps

1. **Run `/sp.tasks`** to generate implementation task list
2. Begin Phase 1 (Backend Foundation)
3. Run tests after each implementation step
4. Verify constitution compliance throughout

---

## Complexity Tracking

> **No violations to justify** - All implementation follows constitution principles.

| Principle | Adherence | Notes |
|-----------|-----------|-------|
| Security-First | Full | JWT on all endpoints, user isolation |
| API Contract | Full | OpenAPI documented, consistent patterns |
| Database Integrity | Full | FK, indexes, constraints |
| Test-First | Full | pytest and Vitest configured |
| User Isolation | Full | All queries filtered |
| Simplicity | Full | Minimal viable scope |
