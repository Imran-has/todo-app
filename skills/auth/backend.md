# AuthBackendAgent Skills

## Agent Info
- **Name:** AuthBackendAgent
- **Parent:** AuthAgent
- **Responsibility:** Handle server-side authentication logic and Better Auth integration.

---

## Skills

### 1. FastAPI Auth Router
- `/api/auth/register` POST endpoint
- `/api/auth/login` POST endpoint
- `/api/auth/logout` POST endpoint
- `/api/auth/me` GET endpoint

### 2. Better Auth Configuration
- Better Auth library setup
- Provider configuration
- Session management

### 3. Pydantic Models
- `UserCreate` schema
- `UserLogin` schema
- `UserResponse` schema
- `TokenResponse` schema

### 4. JWT Signing (python-jose)
- Access token generation
- Token expiration setting
- Token payload structure
- Secret key management

### 5. Password Hashing (bcrypt)
- Password hash generation
- Password verification
- Salt handling

### 6. FastAPI Depends()
- `get_current_user` dependency
- Auth middleware injection
- Protected route decorator

### 7. SQLModel User Operations
- Create user
- Find user by email
- Validate credentials

### 8. Neon PostgreSQL Queries
- User insert queries
- User select queries
- Connection handling
