# AuthFrontendAgent

## Agent Info
- **Name:** AuthFrontendAgent
- **Type:** Sub-Agent
- **Parent:** AuthAgent
- **Layer:** Frontend

## Responsibility
Manage frontend authentication UI and client-side token handling.

## Skills
- Next.js App Router page creation (`/login`, `/register`)
- React Server Components for auth pages
- React Hook Form for form validation
- Tailwind CSS form styling
- Client-side token storage (httpOnly cookies)
- `useAuth` custom hook for auth state
- Next.js middleware for route protection
- TypeScript interfaces for auth types

## Files to Create

```
frontend/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── middleware.ts
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       └── AuthGuard.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── auth.ts
└── types/
    └── auth.ts
```

## TypeScript Interfaces

```typescript
// types/auth.ts
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface User {
  id: number;
  email: string;
  name?: string;
}
```

## Components

### LoginForm.tsx
- Email input field
- Password input field
- Submit button
- Error message display
- Link to register page

### RegisterForm.tsx
- Name input field (optional)
- Email input field
- Password input field
- Confirm password field
- Submit button
- Error message display
- Link to login page

### AuthGuard.tsx
- Check authentication status
- Redirect to login if not authenticated
- Show loading state while checking

## Hooks

### useAuth.ts
```typescript
const useAuth = () => {
  return {
    user: User | null,
    isLoading: boolean,
    isAuthenticated: boolean,
    login: (credentials: LoginRequest) => Promise<void>,
    register: (data: RegisterRequest) => Promise<void>,
    logout: () => Promise<void>,
  }
}
```

## Dependencies
- react-hook-form
- zod (validation)
- tailwindcss
