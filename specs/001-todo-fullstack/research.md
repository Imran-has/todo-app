# Research: Todo Full-Stack Web Application

**Branch**: `001-todo-fullstack`
**Date**: 2025-12-24
**Status**: Complete

## Overview

This document captures research findings and technology decisions for the Phase II Todo Full-Stack Web Application implementation.

---

## 1. Authentication Integration: Better Auth with FastAPI

### Decision
Use Better Auth on the frontend (Next.js) for user authentication, with JWT tokens passed to the FastAPI backend for API authorization.

### Rationale
- Better Auth provides a complete authentication solution for Next.js with minimal configuration
- JWT tokens are stateless and work well with serverless backends
- Separation of concerns: frontend handles auth UI, backend validates tokens

### Alternatives Considered
| Alternative | Reason Rejected |
|-------------|-----------------|
| NextAuth.js | Less feature-rich for custom JWT handling |
| Auth0 | External dependency, cost concerns for MVP |
| Custom auth | Too complex for Phase II, security risks |
| Passport.js | Node.js only, doesn't work with FastAPI |

### Implementation Pattern
```
Frontend (Better Auth) → Issues JWT → Backend (FastAPI) validates JWT
                                    ↓
                            Extracts user_id from token
                                    ↓
                            Compares with URL user_id
```

---

## 2. JWT Token Verification in FastAPI

### Decision
Use `python-jose` library with a custom FastAPI dependency for JWT validation on every request.

### Rationale
- `python-jose` is well-maintained and supports multiple algorithms
- FastAPI dependencies provide clean, reusable authentication logic
- Middleware pattern ensures no endpoint can bypass auth

### Key Configuration
| Setting | Value | Notes |
|---------|-------|-------|
| Algorithm | HS256 | Symmetric, fast, sufficient for single-service |
| Token Expiry | 7 days | Matches spec FR-006 |
| Secret Source | `BETTER_AUTH_SECRET` env var | Never hardcoded |

### Verification Flow
1. Extract `Authorization: Bearer <token>` header
2. Decode and verify signature using shared secret
3. Check expiration claim (`exp`)
4. Extract `sub` claim as `user_id`
5. Compare with `{user_id}` path parameter
6. Return 401 if invalid, 403 if user mismatch

---

## 3. Database Connection: Neon PostgreSQL with SQLModel

### Decision
Use SQLModel with asyncpg driver for async database operations with Neon serverless PostgreSQL.

### Rationale
- SQLModel combines SQLAlchemy ORM with Pydantic validation
- Neon supports connection pooling out of the box (important for serverless)
- Async driver matches FastAPI's async architecture

### Connection Configuration
```python
# Pattern for Neon connection string
DATABASE_URL = "postgresql+asyncpg://user:pass@host/db?sslmode=require"
```

### Connection Pooling
| Setting | Value | Notes |
|---------|-------|-------|
| Pool Size | 5 | Appropriate for serverless |
| Max Overflow | 10 | Handle burst traffic |
| Pool Timeout | 30s | Avoid hanging requests |

### Alternatives Considered
| Alternative | Reason Rejected |
|-------------|-----------------|
| Raw asyncpg | Loses ORM benefits, more boilerplate |
| SQLAlchemy only | No Pydantic integration |
| Prisma | Python client is less mature |
| Supabase | Additional service complexity |

---

## 4. Frontend API Client Pattern

### Decision
Create a centralized API client in `/lib/api.ts` that automatically attaches JWT tokens to all requests.

### Rationale
- Single point of configuration for base URL and auth headers
- Automatic token refresh handling
- Consistent error handling across all API calls

### Pattern
```typescript
// Conceptual pattern - not implementation
class ApiClient {
  private getToken(): string | null
  private async request<T>(method, path, body?): Promise<T>

  // Typed methods for each endpoint
  async getTasks(userId: string, filters?): Promise<TaskList>
  async createTask(userId: string, task: CreateTask): Promise<Task>
  // ... etc
}
```

### Token Storage
| Option | Decision | Rationale |
|--------|----------|-----------|
| localStorage | No | XSS vulnerable |
| httpOnly cookie | Yes | More secure, automatic on requests |
| Memory only | Backup | For SSR hydration |

---

## 5. Next.js Architecture: App Router with Server Components

### Decision
Use Next.js App Router with Server Components by default, Client Components only for interactivity.

### Rationale
- Server Components reduce client bundle size
- Better initial page load performance
- Natural fit for data fetching on protected routes

### Component Strategy
| Component Type | Use Case |
|----------------|----------|
| Server Component | Page layouts, data fetching, static content |
| Client Component | Forms, buttons, real-time updates, auth state |

### Route Structure
```
app/
├── (auth)/
│   ├── login/page.tsx      # Client - form
│   └── signup/page.tsx     # Client - form
├── (protected)/
│   ├── layout.tsx          # Server - auth check
│   └── tasks/
│       ├── page.tsx        # Server - task list
│       └── [id]/page.tsx   # Server - task detail
└── layout.tsx              # Server - root layout
```

---

## 6. CORS Configuration

### Decision
Configure FastAPI CORS to allow only the Next.js frontend origin.

### Rationale
- Security requirement from constitution
- Prevents unauthorized cross-origin requests
- Required for browser-based API calls

### Configuration
| Environment | Allowed Origin |
|-------------|----------------|
| Development | `http://localhost:3000` |
| Production | `https://your-domain.com` |

### Settings
```python
# Pattern - not implementation
allow_origins = [FRONTEND_URL]
allow_credentials = True  # For cookie-based auth
allow_methods = ["GET", "POST", "PUT", "DELETE", "PATCH"]
allow_headers = ["Authorization", "Content-Type"]
```

---

## 7. Error Handling Strategy

### Decision
Standardized error response format across all endpoints with appropriate HTTP status codes.

### Error Response Format
```json
{
  "detail": "Human-readable error message"
}
```

### Status Code Mapping
| Scenario | Code | Detail Message Pattern |
|----------|------|----------------------|
| Missing/invalid token | 401 | "Not authenticated" |
| User ID mismatch | 403 | "Access denied" |
| Resource not found | 404 | "{Resource} not found" |
| Validation failure | 400 | Specific field error |
| Server error | 500 | "Internal server error" |

---

## 8. Testing Strategy

### Decision
Layered testing approach with pytest for backend and Vitest for frontend.

### Backend Testing Layers
| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Contract | pytest + httpx | API request/response schemas |
| Integration | pytest + test DB | Auth flows, CRUD operations |
| Unit | pytest | Service logic, validation |

### Frontend Testing Layers
| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Component | Vitest + Testing Library | UI components |
| Integration | Playwright | User flows |

### Test Database Strategy
- Use separate Neon database or SQLite for tests
- Reset database before each test suite
- Seed with known test data

---

## Summary of Technology Decisions

| Category | Choice | Key Dependency |
|----------|--------|----------------|
| Frontend Framework | Next.js 16+ | React 18 |
| Frontend Auth | Better Auth | @better-auth/nextjs |
| Styling | Tailwind CSS | tailwindcss |
| Backend Framework | FastAPI | fastapi, uvicorn |
| ORM | SQLModel | sqlmodel, asyncpg |
| Database | Neon PostgreSQL | Connection string |
| JWT Library | python-jose | python-jose[cryptography] |
| Testing (Backend) | pytest | pytest, httpx, pytest-asyncio |
| Testing (Frontend) | Vitest | vitest, @testing-library/react |

---

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| How to share auth secret? | Environment variable `BETTER_AUTH_SECRET` |
| Sync vs async ORM? | Async with asyncpg for FastAPI compatibility |
| Where to validate input? | Both Pydantic models and database constraints |
| How to handle token refresh? | Better Auth handles on frontend, 401 triggers refresh |
| Rate limiting needed? | Deferred to Phase III (not in scope) |

---

## References

- [Better Auth Documentation](https://better-auth.com)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Neon Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [Next.js App Router](https://nextjs.org/docs/app)
