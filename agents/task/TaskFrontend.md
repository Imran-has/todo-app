# TaskFrontendAgent

## Agent Info
- **Name:** TaskFrontendAgent
- **Type:** Sub-Agent
- **Parent:** TaskAgent
- **Layer:** Frontend

## Responsibility
Render task UI components and handle user interactions.

## Skills
- Next.js App Router `/tasks` page
- React Server Components for task list
- Client Components for interactive forms
- Tailwind CSS task card styling
- `useTasks` custom hook for state
- React Query/SWR for data fetching
- Optimistic UI updates
- TypeScript Task interface definitions
- Form validation with Zod
- Loading/error state handling

## Files to Create

```
frontend/
├── app/
│   └── tasks/
│       ├── page.tsx
│       └── loading.tsx
├── components/
│   └── tasks/
│       ├── TaskList.tsx
│       ├── TaskCard.tsx
│       ├── TaskForm.tsx
│       ├── TaskItem.tsx
│       ├── DeleteButton.tsx
│       └── EmptyState.tsx
├── hooks/
│   └── useTasks.ts
├── lib/
│   └── tasks.ts
└── types/
    └── task.ts
```

## TypeScript Interfaces

```typescript
// types/task.ts
interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface TaskCreate {
  title: string;
  description?: string;
}

interface TaskUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
}
```

## Components

### TaskList.tsx
- Fetch and display all tasks
- Loading skeleton
- Empty state message

### TaskCard.tsx
- Task title display
- Description preview
- Completed checkbox
- Edit/Delete buttons
- Completed state styling

### TaskForm.tsx
- Title input (required)
- Description textarea (optional)
- Submit button
- Cancel button
- Validation errors

### TaskItem.tsx
- Single task row
- Toggle complete checkbox
- Quick actions

### DeleteButton.tsx
- Delete confirmation
- Loading state
- Error handling

### EmptyState.tsx
- No tasks message
- Add task CTA

## Hooks

### useTasks.ts
```typescript
const useTasks = () => {
  return {
    tasks: Task[],
    isLoading: boolean,
    error: Error | null,
    addTask: (task: TaskCreate) => Promise<Task>,
    updateTask: (id: number, data: TaskUpdate) => Promise<Task>,
    deleteTask: (id: number) => Promise<void>,
    toggleComplete: (id: number) => Promise<Task>,
  }
}
```

## API Functions

```typescript
// lib/tasks.ts
export const tasksApi = {
  getAll: () => fetch('/api/tasks'),
  create: (data: TaskCreate) => fetch('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: TaskUpdate) => fetch(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetch(`/api/tasks/${id}`, { method: 'DELETE' }),
}
```

## Dependencies
- @tanstack/react-query or swr
- react-hook-form
- zod
- tailwindcss
