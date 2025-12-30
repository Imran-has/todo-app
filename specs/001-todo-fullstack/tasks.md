# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/001-todo-fullstack/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/openapi.yaml

**Tests**: Tests are included as Constitution Principle IV (Test-First Development) is specified.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` - Python FastAPI
- **Frontend**: `frontend/` - Next.js with TypeScript
- Paths follow the structure defined in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both backend and frontend

- [x] T001 Create monorepo directory structure with backend/ and frontend/ directories
- [x] T002 [P] Initialize Python virtual environment and create backend/requirements.txt with FastAPI, SQLModel, asyncpg, alembic, python-jose[cryptography], python-dotenv, pytest, httpx, pytest-asyncio
- [x] T003 [P] Initialize Next.js 16+ project with TypeScript in frontend/ using create-next-app
- [x] T004 [P] Configure Tailwind CSS in frontend/tailwind.config.js and frontend/app/globals.css
- [x] T005 [P] Create .env.example with DATABASE_URL, BETTER_AUTH_SECRET, FRONTEND_URL, NEXT_PUBLIC_API_URL placeholders
- [x] T006 [P] Create docker-compose.yml for local development with backend and frontend services

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [ ] T007 Create backend/config.py for environment variable loading with DATABASE_URL, BETTER_AUTH_SECRET, FRONTEND_URL
- [ ] T008 Create backend/database.py with async SQLModel engine and session configuration for Neon PostgreSQL
- [ ] T009 Create backend/models/__init__.py to export all models
- [ ] T010 Create backend/models/user.py with User SQLModel (id, email, name, created_at) per data-model.md
- [ ] T011 Create backend/models/task.py with Task SQLModel (id, user_id, title, description, completed, created_at, updated_at) per data-model.md
- [ ] T012 Initialize Alembic in backend/alembic/ with async PostgreSQL configuration
- [ ] T013 Create initial Alembic migration for users and tasks tables with indexes in backend/alembic/versions/
- [ ] T014 Create backend/schemas/__init__.py to export all Pydantic schemas
- [ ] T015 Create backend/schemas/task.py with TaskCreate, TaskUpdate, TaskResponse, TaskListResponse, ErrorResponse per data-model.md
- [ ] T016 Create backend/middleware/__init__.py
- [ ] T017 Create backend/middleware/auth.py with JWT verification dependency that extracts user_id and validates against path parameter
- [ ] T018 Create backend/routers/__init__.py
- [ ] T019 Create backend/routers/health.py with GET /health endpoint (no auth required)
- [ ] T020 Create backend/main.py with FastAPI app, CORS middleware, and router includes

### Frontend Foundation

- [ ] T021 Create frontend/lib/utils.ts with common utility functions (cn for classnames, formatDate)
- [ ] T022 Create frontend/types/index.ts with Task, User, Session, ApiError, TaskQueryParams TypeScript interfaces per data-model.md
- [ ] T023 Create frontend/lib/auth.ts with Better Auth configuration
- [ ] T024 Create frontend/lib/api.ts with ApiClient class that attaches JWT to all requests and handles errors
- [ ] T025 Create frontend/app/layout.tsx root layout with Tailwind CSS, fonts, and metadata
- [ ] T026 Create frontend/app/page.tsx with redirect to /tasks or /login based on auth state
- [ ] T027 Create frontend/components/ui/Button.tsx reusable button component with variants
- [ ] T028 [P] Create frontend/components/ui/Input.tsx reusable input component with label and error states
- [ ] T029 [P] Create frontend/components/ui/Card.tsx reusable card container component
- [ ] T030 Create frontend/components/layout/Header.tsx with app title, user info, and logout button
- [ ] T031 [P] Create frontend/components/layout/Footer.tsx with copyright

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Registration and Login (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts and log in to access their personal task list

**Independent Test**: Complete registration, log out, and log back in successfully

### Tests for User Story 1

- [ ] T032 [P] [US1] Create backend/tests/conftest.py with test database fixtures and async client setup
- [ ] T033 [P] [US1] Create backend/tests/test_auth.py with JWT middleware tests (valid token, invalid token, expired token, user mismatch)

### Implementation for User Story 1

- [ ] T034 [US1] Implement Better Auth API routes in frontend for signup and login
- [ ] T035 [US1] Create frontend/components/auth/LoginForm.tsx with email/password fields, validation, and submit handler
- [ ] T036 [US1] Create frontend/components/auth/SignupForm.tsx with email/name/password fields, validation, and submit handler
- [ ] T037 [US1] Create frontend/app/(auth)/login/page.tsx login page with LoginForm component
- [ ] T038 [US1] Create frontend/app/(auth)/signup/page.tsx signup page with SignupForm component
- [ ] T039 [US1] Create frontend/app/(protected)/layout.tsx with auth check that redirects to /login if unauthenticated
- [ ] T040 [US1] Update frontend/components/layout/Header.tsx to display logged-in user name and functional logout button
- [ ] T041 [US1] Add navigation links between login and signup pages

**Checkpoint**: Users can register, login, and logout. Protected routes redirect to login.

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable logged-in users to create tasks and see them in a list

**Independent Test**: Create a task and verify it appears in the list; verify users only see their own tasks

### Tests for User Story 2

- [ ] T042 [P] [US2] Create backend/tests/test_tasks.py with tests for POST /api/{user_id}/tasks (valid, invalid title, unauthorized)
- [ ] T043 [P] [US2] Add tests to backend/tests/test_tasks.py for GET /api/{user_id}/tasks (list own tasks, empty list, user isolation)

### Implementation for User Story 2

- [ ] T044 [US2] Create backend/services/__init__.py
- [ ] T045 [US2] Create backend/services/task_service.py with create_task and get_tasks functions
- [ ] T046 [US2] Create backend/routers/tasks.py with POST /api/{user_id}/tasks endpoint for creating tasks
- [ ] T047 [US2] Add GET /api/{user_id}/tasks endpoint to backend/routers/tasks.py for listing tasks
- [ ] T048 [US2] Register tasks router in backend/main.py
- [ ] T049 [US2] Add getTasks and createTask methods to frontend/lib/api.ts
- [ ] T050 [US2] Create frontend/components/tasks/TaskForm.tsx with title input, optional description, validation, and submit
- [ ] T051 [US2] Create frontend/components/tasks/TaskItem.tsx displaying task title, description preview, and completion status
- [ ] T052 [US2] Create frontend/components/tasks/TaskList.tsx that renders list of TaskItem components with empty state
- [ ] T053 [US2] Create frontend/app/(protected)/tasks/page.tsx task list page with TaskForm and TaskList
- [ ] T054 [US2] Add loading states to TaskList and TaskForm components
- [ ] T055 [US2] Add error handling and display for failed task creation

**Checkpoint**: Users can create tasks and view their task list. User isolation enforced.

---

## Phase 5: User Story 3 - Complete and Manage Tasks (Priority: P2)

**Goal**: Enable logged-in users to mark tasks complete, update them, and delete them

**Independent Test**: Toggle task completion, edit a task title, delete a task and verify changes persist

### Tests for User Story 3

- [ ] T056 [P] [US3] Add tests to backend/tests/test_tasks.py for PATCH /api/{user_id}/tasks/{task_id}/complete (toggle, unauthorized, not found)
- [ ] T057 [P] [US3] Add tests to backend/tests/test_tasks.py for PUT /api/{user_id}/tasks/{task_id} (update title, update description, validation)
- [ ] T058 [P] [US3] Add tests to backend/tests/test_tasks.py for DELETE /api/{user_id}/tasks/{task_id} (delete, unauthorized, not found)
- [ ] T059 [P] [US3] Add tests to backend/tests/test_tasks.py for GET /api/{user_id}/tasks/{task_id} (get detail, unauthorized, not found)

### Implementation for User Story 3

- [ ] T060 [US3] Add toggle_completion, update_task, delete_task, get_task functions to backend/services/task_service.py
- [ ] T061 [US3] Add GET /api/{user_id}/tasks/{task_id} endpoint to backend/routers/tasks.py
- [ ] T062 [US3] Add PUT /api/{user_id}/tasks/{task_id} endpoint to backend/routers/tasks.py
- [ ] T063 [US3] Add DELETE /api/{user_id}/tasks/{task_id} endpoint to backend/routers/tasks.py
- [ ] T064 [US3] Add PATCH /api/{user_id}/tasks/{task_id}/complete endpoint to backend/routers/tasks.py
- [ ] T065 [US3] Add getTask, updateTask, deleteTask, toggleComplete methods to frontend/lib/api.ts
- [ ] T066 [US3] Update frontend/components/tasks/TaskItem.tsx with completion checkbox that calls toggleComplete
- [ ] T067 [US3] Add edit button and inline edit mode to frontend/components/tasks/TaskItem.tsx
- [ ] T068 [US3] Add delete button with confirmation dialog to frontend/components/tasks/TaskItem.tsx
- [ ] T069 [US3] Create frontend/app/(protected)/tasks/[id]/page.tsx task detail page with full edit form
- [ ] T070 [US3] Add optimistic updates for toggle completion in TaskItem
- [ ] T071 [US3] Add success/error toast notifications for task operations

**Checkpoint**: Full CRUD operations work. Users can complete, edit, and delete their tasks.

---

## Phase 6: User Story 4 - Filter and Sort Tasks (Priority: P3)

**Goal**: Enable logged-in users to filter and sort their tasks

**Independent Test**: Apply pending filter, apply title sort, reset to all tasks

### Tests for User Story 4

- [ ] T072 [P] [US4] Add tests to backend/tests/test_tasks.py for GET /api/{user_id}/tasks with status query param (all, pending, completed)
- [ ] T073 [P] [US4] Add tests to backend/tests/test_tasks.py for GET /api/{user_id}/tasks with sort and order query params

### Implementation for User Story 4

- [ ] T074 [US4] Update backend/services/task_service.py get_tasks to accept status, sort, order parameters
- [ ] T075 [US4] Update GET /api/{user_id}/tasks in backend/routers/tasks.py to parse and pass filter/sort query params
- [ ] T076 [US4] Update getTasks method in frontend/lib/api.ts to accept TaskQueryParams
- [ ] T077 [US4] Create frontend/components/tasks/TaskFilters.tsx with status filter dropdown (All, Pending, Completed)
- [ ] T078 [US4] Add sort dropdown to frontend/components/tasks/TaskFilters.tsx (Created Date, Title)
- [ ] T079 [US4] Update frontend/app/(protected)/tasks/page.tsx to include TaskFilters and pass params to getTasks
- [ ] T080 [US4] Add URL query parameter sync for filters (preserve filter state on refresh)
- [ ] T081 [US4] Add visual indication of active filters

**Checkpoint**: All user stories complete. Full filtering and sorting functionality available.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T082 [P] Create backend/tests/test_validation.py with input validation edge case tests
- [ ] T083 [P] Create frontend/tests/components/ test setup with Vitest configuration
- [ ] T084 Add responsive design breakpoints to all frontend components
- [ ] T085 Add proper loading skeletons to TaskList during data fetch
- [ ] T086 Add keyboard navigation support to TaskForm and TaskFilters
- [ ] T087 Validate quickstart.md instructions work end-to-end
- [ ] T088 Review and add any missing error handling in frontend components
- [ ] T089 Ensure all API error responses follow consistent ErrorResponse format
- [ ] T090 Final security review: verify no user data leaks across user boundaries

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS all user stories)
    ↓
    ├── Phase 3: US1 - Registration/Login (P1)
    │       ↓
    ├── Phase 4: US2 - Create/View Tasks (P1)
    │       ↓
    ├── Phase 5: US3 - Manage Tasks (P2)
    │       ↓
    └── Phase 6: US4 - Filter/Sort (P3)
            ↓
        Phase 7: Polish
```

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (needs auth to create tasks)
- **User Story 3 (P2)**: Depends on US2 (needs tasks to manage)
- **User Story 4 (P3)**: Depends on US2 (needs tasks to filter/sort)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Backend before frontend (API must exist before UI calls it)
- Models before services
- Services before routers
- Core functionality before enhancements

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005, T006 can all run in parallel
- **Phase 2 Backend**: T010, T011 in parallel; T027, T028, T029, T030, T031 in parallel
- **Phase 3**: T032, T033 tests in parallel
- **Phase 4**: T042, T043 tests in parallel
- **Phase 5**: T056, T057, T058, T059 tests in parallel
- **Phase 6**: T072, T073 tests in parallel
- **Phase 7**: T082, T083 in parallel

---

## Parallel Example: Phase 2 UI Components

```bash
# Launch all UI component tasks in parallel:
Task: "T027 Create frontend/components/ui/Button.tsx"
Task: "T028 Create frontend/components/ui/Input.tsx"
Task: "T029 Create frontend/components/ui/Card.tsx"
Task: "T030 Create frontend/components/layout/Header.tsx"
Task: "T031 Create frontend/components/layout/Footer.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Auth)
4. Complete Phase 4: User Story 2 (Create/View Tasks)
5. **STOP and VALIDATE**: Test MVP independently - users can register, login, create and view tasks
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test auth flows → MVP foundation
3. Add User Story 2 → Test task creation → **MVP Complete!**
4. Add User Story 3 → Test CRUD operations → Enhanced experience
5. Add User Story 4 → Test filtering → Full feature set
6. Polish → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 backend + US2 backend
   - Developer B: US1 frontend + US2 frontend
3. After US1+US2 complete:
   - Developer A: US3 backend + US4 backend
   - Developer B: US3 frontend + US4 frontend
4. Both: Polish phase

---

## Task Summary

| Phase | Tasks | Parallel Tasks | Description |
|-------|-------|----------------|-------------|
| Phase 1: Setup | 6 | 5 | Project initialization |
| Phase 2: Foundational | 25 | 6 | Core infrastructure |
| Phase 3: US1 (Auth) | 10 | 2 | Registration and login |
| Phase 4: US2 (Create/View) | 14 | 2 | Task creation and list |
| Phase 5: US3 (Manage) | 16 | 4 | Update, delete, complete |
| Phase 6: US4 (Filter/Sort) | 10 | 2 | Filtering and sorting |
| Phase 7: Polish | 9 | 2 | Final improvements |
| **Total** | **90** | **23** | |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All backend API paths follow: `/api/{user_id}/tasks[/{task_id}][/action]`
- All frontend paths follow Next.js App Router conventions
