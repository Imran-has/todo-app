# TaskAgent

## Agent Info
- **Name:** TaskAgent
- **Type:** Main Agent
- **Domain:** Task Management

## Responsibility
Manage all task CRUD operations with user-specific data isolation.

## Skills
- Create, read, update, delete tasks
- User-task ownership validation
- Task filtering and listing

## Sub-Agents
| Sub-Agent          | File                | Layer    |
|--------------------|---------------------|----------|
| TaskFrontendAgent  | `TaskFrontend.md`   | Frontend |
| TaskBackendAgent   | `TaskBackend.md`    | Backend  |
| TaskDatabaseAgent  | `TaskDatabase.md`   | Database |

## Workflow

```
User Request (CRUD)
    │
    ▼
┌─────────────────┐
│   TaskAgent     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
Frontend  Backend   Database
 Agent     Agent      Agent
```

## API Endpoints Managed
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get single task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Frontend Routes Managed
- `/tasks` - Task list page
- `/tasks/new` - Create task page (optional)
- `/tasks/{id}` - Task detail page (optional)

## Data Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │◀────│          │◀────│          │
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     │                │                │
  UI/UX          API Logic       Data Storage
  Forms          Validation      Queries
  State          Auth Check      Relationships
```

## Security
- All endpoints require JWT authentication
- Tasks filtered by `user_id` from JWT
- Ownership validation before update/delete
