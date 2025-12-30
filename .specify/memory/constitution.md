<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 → 1.0.0 (MAJOR - initial constitution ratification)

  Modified principles: N/A (initial creation)

  Added sections:
    - I. Security-First Authentication
    - II. API Contract Discipline
    - III. Database Integrity
    - IV. Test-First Development
    - V. User Data Isolation
    - VI. Simplicity & YAGNI
    - Technology Stack Requirements
    - Development Workflow
    - Governance

  Removed sections: None (initial creation)

  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (compatible - Constitution Check section present)
    - .specify/templates/spec-template.md ✅ (compatible - requirements and success criteria align)
    - .specify/templates/tasks-template.md ✅ (compatible - phases support auth and API patterns)

  Follow-up TODOs: None
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Security-First Authentication

Every user interaction MUST be authenticated and authorized before processing. This is NON-NEGOTIABLE.

- All API endpoints (except health checks) MUST require a valid JWT token in the Authorization header
- JWT tokens MUST be verified on every request before any business logic executes
- Tokens MUST be issued only after successful authentication via Better Auth
- Backend MUST validate token signature, expiration, and issuer claims
- Failed authentication MUST return HTTP 401 (Unauthorized)
- Attempting to access another user's resources MUST return HTTP 403 (Forbidden)

**Rationale**: User data privacy and security are paramount. A single authentication bypass could expose all user tasks to malicious actors.

### II. API Contract Discipline

All REST endpoints MUST follow consistent, predictable patterns.

- Endpoints MUST follow the pattern: `GET|POST|PUT|DELETE|PATCH /api/{user_id}/tasks[/{id}][/action]`
- Request/response bodies MUST be JSON with documented schemas
- All endpoints MUST return appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Error responses MUST include a consistent error object: `{ "detail": "message" }`
- API changes MUST be backward-compatible or versioned

**Rationale**: Predictable APIs reduce frontend integration bugs and improve developer experience.

### III. Database Integrity

Data persistence MUST maintain referential integrity and enforce business rules at the database level.

- All tables MUST have primary keys
- Foreign key constraints MUST be enforced (tasks.user_id → users.id)
- Indexes MUST exist on frequently queried columns (user_id, completed)
- Field validations MUST be enforced: title (1-200 chars), description (max 1000 chars)
- Timestamps (created_at, updated_at) MUST be automatically managed
- Database migrations MUST be versioned and reversible

**Rationale**: Database-level constraints prevent data corruption regardless of application bugs.

### IV. Test-First Development

Tests MUST be written before implementation for critical paths.

- Authentication flows MUST have integration tests
- CRUD operations MUST have contract tests verifying request/response schemas
- Authorization checks MUST have tests proving users cannot access others' data
- Red-Green-Refactor cycle: write failing test → implement → refactor
- Tests MUST be isolated and repeatable

**Rationale**: Tests document expected behavior and prevent regressions during development.

### V. User Data Isolation

Users MUST only see and modify their own data. This is NON-NEGOTIABLE.

- All task queries MUST filter by authenticated user_id
- Backend MUST verify user_id in URL matches authenticated user before processing
- No admin endpoints or bulk operations that bypass user isolation
- Soft deletes are optional but hard deletes MUST NOT cascade incorrectly

**Rationale**: Multi-tenant data isolation is critical for user trust and legal compliance.

### VI. Simplicity & YAGNI

Build only what is needed. Avoid premature optimization and over-engineering.

- Start with the minimal viable implementation
- Add complexity only when explicitly required
- Prefer standard library solutions over third-party dependencies
- No feature flags, A/B testing, or analytics unless explicitly requested
- No caching layer unless performance metrics prove it necessary
- Keep functions small and focused on a single responsibility

**Rationale**: Simpler code is easier to debug, test, and maintain. Unused features are technical debt.

## Technology Stack Requirements

The following technology choices are MANDATORY for this project:

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| Frontend | Next.js | 16+ with TypeScript |
| Styling | Tailwind CSS | Utility-first CSS |
| Backend | Python FastAPI | Async API framework |
| ORM | SQLModel | SQLAlchemy + Pydantic |
| Database | Neon PostgreSQL | Serverless PostgreSQL |
| Auth | Better Auth | Frontend auth with JWT |
| API Format | REST + JSON | OpenAPI documented |

**Constraints**:
- All code MUST be TypeScript (frontend) or Python with type hints (backend)
- Environment variables MUST be used for secrets (never hardcode)
- CORS MUST be configured to allow only the frontend origin
- All database credentials MUST use connection pooling for serverless

## Development Workflow

### Branch Strategy

- `master` or `main`: Production-ready code only
- Feature branches: `feature/[short-description]`
- Bug fixes: `fix/[short-description]`

### Code Review Requirements

- All changes MUST be reviewed before merging
- Tests MUST pass before merge
- No console.log or print statements in production code
- All API endpoints MUST be documented

### Development Commands

```bash
# Frontend
cd frontend && npm run dev     # Development server
cd frontend && npm run build   # Production build
cd frontend && npm run test    # Run tests

# Backend
cd backend && uvicorn main:app --reload --port 8000  # Development server
cd backend && pytest                                   # Run tests

# Full Stack
docker-compose up              # Run all services
```

### Commit Guidelines

- Commits MUST be atomic and focused on a single change
- Commit messages MUST follow: `type: brief description`
- Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

## Governance

This constitution supersedes all other development practices for this project. Any deviation MUST be:

1. Documented with explicit justification
2. Approved by the project owner
3. Tracked as technical debt if temporary

### Amendment Process

1. Propose change with rationale
2. Assess impact on existing code and tests
3. Update constitution with new version
4. Propagate changes to dependent templates
5. Document in ADR if architecturally significant

### Versioning Policy

- **MAJOR**: Principle removal or fundamental redefinition
- **MINOR**: New principle added or guidance materially expanded
- **PATCH**: Clarifications, typo fixes, non-semantic changes

### Compliance

- All PRs MUST verify compliance with these principles
- Code reviews MUST check for constitution violations
- Violations MUST be justified in the Complexity Tracking section of the implementation plan

**Version**: 1.0.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-24
