# UserAgent

## Agent Info
- **Name:** UserAgent
- **Type:** Main Agent
- **Domain:** User Management

## Responsibility
Manage user data and ensure task isolation per authenticated user.

## Skills
- User profile retrieval
- User-task relationship enforcement
- User context propagation

## Sub-Agents
| Sub-Agent          | File                | Layer    |
|--------------------|---------------------|----------|
| UserFrontendAgent  | `UserFrontend.md`   | Frontend |
| UserBackendAgent   | `UserBackend.md`    | Backend  |
| UserDatabaseAgent  | `UserDatabase.md`   | Database |

## Workflow

```
User Profile Request
    │
    ▼
┌─────────────────┐
│   UserAgent     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
Frontend  Backend   Database
 Agent     Agent      Agent
```

## API Endpoints Managed
- `GET /api/users/me` - Get current user profile

## Frontend Features
- User context provider
- Profile display component
- Logout functionality

## Data Isolation
- Every task query filtered by `user_id`
- User ID extracted from JWT token
- No cross-user data access

## Security
- JWT-based user identification
- User data only accessible to owner
- Password hash never exposed
