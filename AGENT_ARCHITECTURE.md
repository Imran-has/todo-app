# Todo App Agent Architecture (Phase II)

## Overview

- **Project:** Todo Full-Stack Web Application
- **Stack:** Next.js + FastAPI + Neon PostgreSQL + Better Auth
- **Total Agents:** 3 Main Agents, 9 Sub-Agents

---

## Agent Name: AuthAgent

**Responsibility:** Handle all authentication flows including user registration, login, logout, and JWT token management.

**Skills:**
- JWT token generation and validation
- Password hashing and verification
- Session management
- Protected route enforcement

### Sub-Agents:

#### AuthFrontendAgent
**Responsibility:** Manage frontend authentication UI and client-side token handling.

**Skills:**
- Next.js App Router page creation (`/login`, `/register`)
- React Server Components for auth pages
- React Hook Form for form validation
- Tailwind CSS form styling
- Client-side token storage (httpOnly cookies)
- `useAuth` custom hook for auth state
- Next.js middleware for route protection
- TypeScript interfaces for auth types

#### AuthBackendAgent
**Responsibility:** Handle server-side authentication logic and Better Auth integration.

**Skills:**
- FastAPI auth router setup
- Better Auth library configuration
- Pydantic models for login/register requests
- JWT signing with `python-jose`
- Password hashing with `bcrypt`
- FastAPI `Depends()` for auth middleware
- SQLModel User model definition
- Neon PostgreSQL user table queries

#### AuthDatabaseAgent
**Responsibility:** Manage user authentication data in database.

**Skills:**
- SQLModel User schema design
- Neon PostgreSQL connection pooling
- User table migrations
- Indexed queries on email field
- Password hash storage
- Created/updated timestamps

---

## Agent Name: TaskAgent

**Responsibility:** Manage all task CRUD operations with user-specific data isolation.

**Skills:**
- Create, read, update, delete tasks
- User-task ownership validation
- Task filtering and listing

### Sub-Agents:

#### TaskFrontendAgent
**Responsibility:** Render task UI components and handle user interactions.

**Skills:**
- Next.js App Router `/tasks` page
- React Server Components for task list
- Client Components for interactive forms
- Tailwind CSS task card styling
- `useTasks` custom hook for state
- React Query/SWR for data fetching
- Optimistic UI updates
- TypeScript Task interface definitions
- Form validation with Zod
- Loading/error state handling

#### TaskBackendAgent
**Responsibility:** Process task API requests with database operations.

**Skills:**
- FastAPI task router (`/api/tasks`)
- Pydantic TaskCreate/TaskUpdate schemas
- FastAPI path operations (GET, POST, PUT, DELETE)
- JWT user extraction from headers
- SQLModel Task CRUD functions
- User ownership validation middleware
- Response model serialization
- Error handling with HTTPException

#### TaskDatabaseAgent
**Responsibility:** Handle task data persistence and queries.

**Skills:**
- SQLModel Task schema design
- Foreign key to User table
- Neon PostgreSQL task queries
- Filtered queries by `user_id`
- Task table migrations
- Indexed queries on `user_id`
- Soft delete implementation
- Created/updated/completed timestamps

---

## Agent Name: UserAgent

**Responsibility:** Manage user data and ensure task isolation per authenticated user.

**Skills:**
- User profile retrieval
- User-task relationship enforcement
- User context propagation

### Sub-Agents:

#### UserFrontendAgent
**Responsibility:** Display user information and manage user context.

**Skills:**
- Next.js user context provider
- React Context for user state
- User profile display component
- Tailwind CSS user UI styling
- TypeScript User interface
- Logout button component

#### UserBackendAgent
**Responsibility:** Handle user data operations via API.

**Skills:**
- FastAPI user router (`/api/users/me`)
- Pydantic UserResponse schema
- Current user extraction from JWT
- User profile endpoint
- SQLModel user queries
- User validation utilities

#### UserDatabaseAgent
**Responsibility:** Manage user data in database.

**Skills:**
- SQLModel User schema
- Neon PostgreSQL user queries
- User lookup by ID/email
- User-Task relationship definition
- Database connection management

---

## Summary Table

| Agent      | Sub-Agents                                              | Focus Area          |
|------------|---------------------------------------------------------|---------------------|
| AuthAgent  | AuthFrontendAgent, AuthBackendAgent, AuthDatabaseAgent  | Authentication/JWT  |
| TaskAgent  | TaskFrontendAgent, TaskBackendAgent, TaskDatabaseAgent  | Task CRUD           |
| UserAgent  | UserFrontendAgent, UserBackendAgent, UserDatabaseAgent  | User isolation      |

---

## Technology Stack Reference

| Layer     | Technologies                                       |
|-----------|----------------------------------------------------|
| Frontend  | Next.js 14+, TypeScript, Tailwind CSS, React Query |
| Backend   | FastAPI, Pydantic, SQLModel, Better Auth           |
| Database  | Neon PostgreSQL, SQLModel ORM                      |
| Auth      | Better Auth, JWT, bcrypt                           |

---

## Agent Hierarchy Diagram

```
AuthAgent
├── AuthFrontendAgent (Next.js auth pages, forms, middleware)
├── AuthBackendAgent  (FastAPI auth routes, Better Auth, JWT)
└── AuthDatabaseAgent (User schema, password storage)

TaskAgent
├── TaskFrontendAgent (Task UI, React Query, Tailwind)
├── TaskBackendAgent  (CRUD endpoints, ownership validation)
└── TaskDatabaseAgent (Task schema, user_id foreign key)

UserAgent
├── UserFrontendAgent (User context, profile display)
├── UserBackendAgent  (User API, current user endpoint)
└── UserDatabaseAgent (User queries, relationships)
```

---

## Phase II Features Covered

- [x] User Registration
- [x] User Login/Logout
- [x] JWT Authentication
- [x] Task Create
- [x] Task Read (List)
- [x] Task Update
- [x] Task Delete
- [x] User-specific Task Isolation
