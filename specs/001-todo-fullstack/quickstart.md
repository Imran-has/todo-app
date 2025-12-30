# Quickstart Guide: Todo Full-Stack Web Application

**Branch**: `001-todo-fullstack`
**Date**: 2025-12-24

This guide helps developers get the Todo Full-Stack application running locally.

---

## Prerequisites

### Required Software

| Software | Version | Check Command |
|----------|---------|---------------|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Python | 3.11+ | `python --version` |
| pip | 23+ | `pip --version` |
| Git | 2.40+ | `git --version` |

### Required Accounts

- **Neon**: PostgreSQL database ([neon.tech](https://neon.tech))
- Create a new project and note the connection string

---

## Project Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd todo-app
git checkout 001-todo-fullstack
```

### 2. Environment Configuration

Create environment files for both frontend and backend:

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql+asyncpg://user:password@host/database?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters
```

> **Important**: Use the same `BETTER_AUTH_SECRET` in both files.

---

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate (Linux/macOS)
source venv/bin/activate

# Activate (Windows)
.\venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations

```bash
# Create tables
python -m alembic upgrade head
```

### 4. Start Development Server

```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

### 5. Verify Backend

```bash
# Health check
curl http://localhost:8000/health

# Expected response
{"status": "healthy"}
```

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 3. Verify Frontend

Open `http://localhost:3000` in your browser. You should see the login page.

---

## Running Both Services

### Option 1: Two Terminal Windows

**Terminal 1 (Backend)**:
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

### Option 2: Docker Compose (When Available)

```bash
docker-compose up
```

---

## Test the Application

### 1. Create an Account

1. Go to `http://localhost:3000/signup`
2. Enter email, name, and password
3. Click "Sign Up"

### 2. Create a Task

1. After login, you'll see the task list
2. Enter a task title in the input field
3. Click "Add Task"
4. The task appears in your list

### 3. Complete a Task

1. Click the checkbox next to a task
2. The task shows as completed

### 4. Test User Isolation

1. Create a second account (different email)
2. Log in with the second account
3. Verify you don't see the first user's tasks

---

## API Testing with curl

### Get JWT Token

After logging in via the UI, extract the token from browser DevTools (Network tab) or use Better Auth's API directly.

### List Tasks

```bash
curl -X GET "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer {token}"
```

### Create Task

```bash
curl -X POST "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "description": "Created via curl"}'
```

### Toggle Completion

```bash
curl -X PATCH "http://localhost:8000/api/{user_id}/tasks/{task_id}/complete" \
  -H "Authorization: Bearer {token}"
```

---

## Common Issues

### Database Connection Failed

- Verify `DATABASE_URL` is correct
- Check Neon dashboard for connection limits
- Ensure `?sslmode=require` is in the URL

### CORS Errors

- Verify `FRONTEND_URL` in backend `.env` matches frontend origin
- Clear browser cache and restart backend

### Authentication Errors

- Ensure `BETTER_AUTH_SECRET` is identical in both `.env` files
- Check token hasn't expired (7 day limit)
- Verify user_id in URL matches authenticated user

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

---

## Development Workflow

### Making Backend Changes

1. Edit Python files in `backend/`
2. Uvicorn auto-reloads on save
3. Run tests: `pytest`

### Making Frontend Changes

1. Edit TypeScript files in `frontend/`
2. Next.js auto-reloads on save
3. Run tests: `npm run test`

### Database Schema Changes

1. Modify models in `backend/models/`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Apply migration: `alembic upgrade head`

---

## Project Structure

```
todo-app/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── models/              # SQLModel models
│   ├── routers/             # API route handlers
│   ├── services/            # Business logic
│   ├── middleware/          # Auth middleware
│   ├── alembic/             # Database migrations
│   ├── tests/               # Backend tests
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   ├── types/               # TypeScript types
│   └── package.json         # Node dependencies
│
├── specs/                   # Specifications (this folder)
└── docker-compose.yml       # Docker configuration
```

---

## Next Steps

After completing this quickstart:

1. Review the [API documentation](./api/rest-endpoints.md)
2. Read the [data model](./data-model.md) for entity details
3. Check the [constitution](../.specify/memory/constitution.md) for coding standards
4. Run `/sp.tasks` to generate implementation tasks
