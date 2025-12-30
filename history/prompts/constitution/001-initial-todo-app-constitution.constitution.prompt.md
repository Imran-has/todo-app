---
id: 001
title: Initial Todo App Constitution
stage: constitution
date: 2025-12-24
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["constitution", "project-setup", "full-stack", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

You are a full-stack developer AI. Implement the Phase II Todo Full-Stack Web Application using the following rules and specifications:

## Project Setup
- Monorepo: `hackathon-todo/`
- Frontend: Next.js 16+, TypeScript, Tailwind CSS
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT
- Spec-Driven: Use Claude Code + Spec-Kit Plus

## Task Features
- Task CRUD: Create, Read (list & detail), Update, Delete
- Mark task complete
- Only authenticated users can access tasks

## Authentication
- Use Better Auth on frontend for signup/login
- Issue JWT token after login
- Include JWT token in Authorization header: `Bearer <token>`
- Backend verifies JWT token and ensures user can only access their own tasks

## API Endpoints
- GET /api/{user_id}/tasks → List all tasks for current user
- POST /api/{user_id}/tasks → Create new task
- GET /api/{user_id}/tasks/{id} → Task details
- PUT /api/{user_id}/tasks/{id} → Update task
- DELETE /api/{user_id}/tasks/{id} → Delete task
- PATCH /api/{user_id}/tasks/{id}/complete → Toggle completion

## Database Schema
- users: id (string, PK), email (unique), name, created_at
- tasks: id (int, PK), user_id (FK → users.id), title (1–200 chars), description (optional, max 1000 chars), completed (boolean, default false), created_at, updated_at
- Indexes: tasks.user_id, tasks.completed

## Workflow
- Read relevant spec before implementing: `@specs/features/task-crud.md`, `@specs/api/rest-endpoints.md`, `@specs/database/schema.md`
- Implement backend following `backend/CLAUDE.md` guidelines
- Implement frontend following `frontend/CLAUDE.md` guidelines
- Ensure API calls attach JWT token
- Filter all data by authenticated user
- Return proper HTTP codes: 401 if no token, 403 if user tries to access others' tasks

## Development Commands
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && uvicorn main:app --reload --port 8000`
- Docker: `docker-compose up`

## Goal
Build a modern, multi-user, responsive Todo web application that:
- Enforces user authentication and authorization
- Persists data in PostgreSQL
- Follows Spec-Kit + Claude Code workflow
- Works seamlessly with JWT-secured REST API

## Response snapshot

Created project constitution v1.0.0 for the Todo Full-Stack Web Application with six core principles:

1. **Security-First Authentication** - JWT validation on all endpoints, proper 401/403 responses
2. **API Contract Discipline** - RESTful patterns, consistent JSON schemas, proper HTTP codes
3. **Database Integrity** - Foreign keys, indexes, field validations, managed timestamps
4. **Test-First Development** - TDD for auth flows, CRUD operations, authorization checks
5. **User Data Isolation** - All queries filtered by user_id, URL user verification
6. **Simplicity & YAGNI** - Minimal viable implementation, no premature optimization

Also defined technology stack (Next.js, FastAPI, SQLModel, Neon PostgreSQL, Better Auth), development workflow, and governance rules.

## Outcome

- Impact: Established foundational governance document for the project
- Tests: N/A (documentation)
- Files: .specify/memory/constitution.md
- Next prompts: /sp.specify to create feature specification, /sp.plan for architecture
- Reflection: Constitution covers all security and data isolation requirements from the prompt

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
