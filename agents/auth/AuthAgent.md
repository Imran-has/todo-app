# AuthAgent

## Agent Info
- **Name:** AuthAgent
- **Type:** Main Agent
- **Domain:** Authentication & Authorization

## Responsibility
Handle all authentication flows including user registration, login, logout, and JWT token management.

## Skills
- JWT token generation and validation
- Password hashing and verification
- Session management
- Protected route enforcement

## Sub-Agents
| Sub-Agent          | File                | Layer    |
|--------------------|---------------------|----------|
| AuthFrontendAgent  | `AuthFrontend.md`   | Frontend |
| AuthBackendAgent   | `AuthBackend.md`    | Backend  |
| AuthDatabaseAgent  | `AuthDatabase.md`   | Database |

## Workflow

```
User Request
    │
    ▼
┌─────────────────┐
│   AuthAgent     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
Frontend  Backend   Database
 Agent     Agent      Agent
```

## API Endpoints Managed
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user info

## Frontend Routes Managed
- `/login` - Login page
- `/register` - Registration page

## Dependencies
- Better Auth library
- python-jose (JWT)
- bcrypt (password hashing)
- Next.js middleware
