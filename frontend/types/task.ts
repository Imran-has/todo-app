// Priority levels for tasks
export type Priority = "high" | "medium" | "low";

// Sort options for task list
export type SortOption = "newest" | "oldest" | "completed" | "priority" | "due_date";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: Priority;
  due_date?: string;
}

export interface TaskUpdate {
  title: string;
  description?: string;
  priority?: Priority;
  due_date?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
}
