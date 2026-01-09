# Skills Folder Structure

## Overview

This folder contains all agent skills organized by agent type.

```
skills/
├── README.md
├── auth/
│   ├── frontend.md    # AuthFrontendAgent skills
│   ├── backend.md     # AuthBackendAgent skills
│   └── database.md    # AuthDatabaseAgent skills
├── task/
│   ├── frontend.md    # TaskFrontendAgent skills
│   ├── backend.md     # TaskBackendAgent skills
│   └── database.md    # TaskDatabaseAgent skills
└── user/
    ├── frontend.md    # UserFrontendAgent skills
    ├── backend.md     # UserBackendAgent skills
    └── database.md    # UserDatabaseAgent skills
```

## Agent Summary

| Agent     | Frontend | Backend | Database |
|-----------|----------|---------|----------|
| Auth      | ✅       | ✅      | ✅       |
| Task      | ✅       | ✅      | ✅       |
| User      | ✅       | ✅      | ✅       |

## Technology Stack

| Layer    | Technologies                          |
|----------|---------------------------------------|
| Frontend | Next.js, TypeScript, Tailwind, React Query |
| Backend  | FastAPI, Pydantic, SQLModel, Better Auth |
| Database | Neon PostgreSQL, SQLModel ORM         |

## Phase II Features

- [x] User Registration
- [x] User Login/Logout
- [x] JWT Authentication
- [x] Task CRUD
- [x] User-specific Task Isolation
