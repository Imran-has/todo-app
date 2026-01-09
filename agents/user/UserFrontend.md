# UserFrontendAgent

## Agent Info
- **Name:** UserFrontendAgent
- **Type:** Sub-Agent
- **Parent:** UserAgent
- **Layer:** Frontend

## Responsibility
Display user information and manage user context.

## Skills
- Next.js user context provider
- React Context for user state
- User profile display component
- Tailwind CSS user UI styling
- TypeScript User interface
- Logout button component

## Files to Create

```
frontend/
├── contexts/
│   └── UserContext.tsx
├── components/
│   └── user/
│       ├── UserProvider.tsx
│       ├── UserProfile.tsx
│       ├── UserAvatar.tsx
│       └── LogoutButton.tsx
├── hooks/
│   └── useUser.ts
└── types/
    └── user.ts
```

## TypeScript Interfaces

```typescript
// types/user.ts
interface User {
  id: number;
  email: string;
  name?: string;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

## Components

### UserProvider.tsx
```typescript
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current user on mount
    fetchCurrentUser();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
```

### UserProfile.tsx
```typescript
export function UserProfile() {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-3">
      <UserAvatar name={user?.name} email={user?.email} />
      <div>
        <p className="font-medium">{user?.name || 'User'}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
}
```

### UserAvatar.tsx
```typescript
export function UserAvatar({ name, email }: { name?: string; email?: string }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase()
    : email?.[0].toUpperCase() || '?';

  return (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
      {initials}
    </div>
  );
}
```

### LogoutButton.tsx
```typescript
export function LogoutButton() {
  const { logout } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

## Hooks

### useUser.ts
```typescript
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
```

## Dependencies
- react
- next/navigation
- tailwindcss
