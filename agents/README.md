# Agents Folder Structure

## Overview

This folder contains all agent definitions organized by agent type.

```
agents/
├── README.md
├── auth/
│   ├── AuthAgent.md        # Main Agent
│   ├── AuthFrontend.md     # Sub-Agent (Frontend)
│   ├── AuthBackend.md      # Sub-Agent (Backend)
│   └── AuthDatabase.md     # Sub-Agent (Database)
├── task/
│   ├── TaskAgent.md        # Main Agent
│   ├── TaskFrontend.md     # Sub-Agent (Frontend)
│   ├── TaskBackend.md      # Sub-Agent (Backend)
│   └── TaskDatabase.md     # Sub-Agent (Database)
└── user/
    ├── UserAgent.md        # Main Agent
    ├── UserFrontend.md     # Sub-Agent (Frontend)
    ├── UserBackend.md      # Sub-Agent (Backend)
    └── UserDatabase.md     # Sub-Agent (Database)
```

## Agent Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                     MAIN AGENTS                         │
├─────────────────┬─────────────────┬─────────────────────┤
│   AuthAgent     │   TaskAgent     │     UserAgent       │
└────────┬────────┴────────┬────────┴──────────┬──────────┘
         │                 │                   │
    ┌────┴────┐       ┌────┴────┐         ┌────┴────┐
    │ Frontend│       │ Frontend│         │ Frontend│
    │ Backend │       │ Backend │         │ Backend │
    │ Database│       │ Database│         │ Database│
    └─────────┘       └─────────┘         └─────────┘
```

## Agent Summary

| Main Agent | Sub-Agents | Domain |
|------------|------------|--------|
| AuthAgent | AuthFrontend, AuthBackend, AuthDatabase | Authentication |
| TaskAgent | TaskFrontend, TaskBackend, TaskDatabase | Task CRUD |
| UserAgent | UserFrontend, UserBackend, UserDatabase | User Management |

## Layers

| Layer | Responsibility | Technologies |
|-------|----------------|--------------|
| Frontend | UI/UX, State, Forms | Next.js, React, Tailwind |
| Backend | API, Business Logic | FastAPI, Pydantic |
| Database | Data Persistence | SQLModel, Neon PostgreSQL |

## Phase II Features

- [x] User Registration
- [x] User Login/Logout
- [x] JWT Authentication
- [x] Task Create
- [x] Task Read (List)
- [x] Task Update
- [x] Task Delete
- [x] User-specific Task Isolation

## File Counts

- **Total Files:** 13
- **Main Agent Files:** 3
- **Sub-Agent Files:** 9
- **README:** 1
