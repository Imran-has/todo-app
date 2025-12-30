# AuthBackendAgent

## Agent Info
- **Name:** AuthBackendAgent
- **Type:** Sub-Agent
- **Parent:** AuthAgent
- **Layer:** Backend

## Responsibility
Handle server-side authentication logic and Better Auth integration.

## Skills
- FastAPI auth router setup
- Better Auth library configuration
- Pydantic models for login/register requests
- JWT signing with `python-jose`
- Password hashing with `bcrypt`
- FastAPI `Depends()` for auth middleware
- SQLModel User model definition
- Neon PostgreSQL user table queries

## Files to Create

```
backend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── __init__.py
│   │       └── router.py
│   ├── core/
│   │   ├── security.py
│   │   └── config.py
│   ├── models/
│   │   └── user.py
│   ├── schemas/
│   │   └── auth.py
│   └── dependencies/
│       └── auth.py
```

## API Endpoints

### POST /api/auth/register
```python
@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session):
    # Check if user exists
    # Hash password
    # Create user
    # Return user
```

### POST /api/auth/login
```python
@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session):
    # Validate credentials
    # Generate JWT token
    # Return token
```

### POST /api/auth/logout
```python
@router.post("/logout")
async def logout(current_user: User):
    # Invalidate session
    # Return success
```

### GET /api/auth/me
```python
@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user: User):
    # Return current user
```

## Pydantic Schemas

```python
# schemas/auth.py
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: str
    name: str | None
    created_at: datetime
```

## Security Functions

```python
# core/security.py
def hash_password(password: str) -> str:
    # bcrypt hash

def verify_password(plain: str, hashed: str) -> bool:
    # bcrypt verify

def create_access_token(data: dict) -> str:
    # JWT sign with python-jose

def decode_access_token(token: str) -> dict:
    # JWT decode
```

## Auth Dependency

```python
# dependencies/auth.py
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    # Decode token
    # Get user from DB
    # Return user
```

## Dependencies
- fastapi
- python-jose[cryptography]
- passlib[bcrypt]
- pydantic[email]
