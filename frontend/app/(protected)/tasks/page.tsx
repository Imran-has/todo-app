"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession, getBearerToken } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import type { Task, TaskListResponse, TaskCreate, SortOption, Priority } from "@/types/task";

import {
  TaskCard,
  TaskInput,
  TaskSkeleton,
  EmptyState,
  ErrorAlert,
  FilterPills,
  SortDropdown,
} from "@/components/ui";

// Priority order for sorting (high = 0, medium = 1, low = 2)
const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [isCreating, setIsCreating] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const token = getBearerToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Fetch all tasks to get accurate counts
      const data = await apiRequest<TaskListResponse>(
        `/api/${session.user.id}/tasks`,
        { token }
      );
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter and sort tasks locally for better UX
  const filteredTasks = useMemo(() => {
    // First, filter
    let result: Task[];
    switch (filter) {
      case "active":
        result = tasks.filter((t) => !t.completed);
        break;
      case "completed":
        result = tasks.filter((t) => t.completed);
        break;
      default:
        result = [...tasks];
    }

    // Then, sort
    result.sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "completed":
          // Completed tasks first, then by created date
          if (a.completed !== b.completed) return a.completed ? -1 : 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "priority":
          // High priority first, then by created date
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "due_date":
          // Tasks with due dates first, sorted by due date, then by created date
          if (!a.due_date && !b.due_date) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filter, sort]);

  // Calculate counts for filter pills
  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  async function handleCreateTask(
    title: string,
    description?: string,
    priority?: Priority,
    dueDate?: string
  ) {
    if (!session?.user?.id) return;

    setIsCreating(true);
    try {
      const token = getBearerToken();
      if (!token) return;

      const taskData: TaskCreate = {
        title,
        priority: priority || "medium",
      };
      if (description) taskData.description = description;
      if (dueDate) taskData.due_date = dueDate;

      const newTask = await apiRequest<Task>(`/api/${session.user.id}/tasks`, {
        method: "POST",
        body: taskData,
        token,
      });

      // Optimistic update - add to beginning
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      throw err; // Re-throw to let the input know it failed
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleComplete(task: Task) {
    if (!session?.user?.id) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      const token = getBearerToken();
      if (!token) return;

      const action = task.completed ? "incomplete" : "complete";
      await apiRequest<Task>(
        `/api/${session.user.id}/tasks/${task.id}/${action}`,
        { method: "PATCH", token }
      );
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: task.completed } : t
        )
      );
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  async function handleDeleteTask(taskId: number) {
    if (!session?.user?.id) return;

    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const token = getBearerToken();
      if (!token) return;

      await apiRequest(`/api/${session.user.id}/tasks/${taskId}`, {
        method: "DELETE",
        token,
      });
    } catch (err) {
      // Refetch on error
      fetchTasks();
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  // Calculate progress
  const progressPercentage =
    tasks.length > 0 ? Math.round((counts.completed / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Tasks</h2>
          <p className="text-slate-500 mt-1">
            {counts.active === 0
              ? "All caught up! Great work."
              : `${counts.active} task${counts.active !== 1 ? "s" : ""} remaining`}
          </p>
        </div>

        {/* Progress indicator */}
        {tasks.length > 0 && (
          <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-2xl shadow-soft border border-slate-100">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-100"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage}, 100`}
                  strokeLinecap="round"
                  className="text-primary-500 transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                {progressPercentage}%
              </span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-700">Progress</p>
              <p className="text-slate-500">
                {counts.completed} of {tasks.length} done
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Task Input */}
      <TaskInput onSubmit={handleCreateTask} isSubmitting={isCreating} />

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onDismiss={() => setError("")} />}

      {/* Filters and Task List */}
      <div className="space-y-6">
        {/* Filter Pills and Sort */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <FilterPills
            filter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />

          <div className="flex items-center gap-3">
            {tasks.length > 0 && (
              <p className="text-sm text-slate-400 hidden sm:block">
                Showing {filteredTasks.length} of {tasks.length}
              </p>
            )}
            {tasks.length > 0 && (
              <SortDropdown sort={sort} onSortChange={setSort} />
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="min-h-[200px]">
          {loading && tasks.length === 0 ? (
            <TaskSkeleton />
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft">
              <EmptyState filter={filter} />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom stats bar */}
        {tasks.length > 0 && !loading && (
          <div
            className="flex items-center justify-between px-4 py-3
                        bg-slate-50 rounded-xl text-sm text-slate-500"
          >
            <span>
              {counts.completed} completed{" "}
              {counts.completed !== tasks.length && `of ${tasks.length}`}
            </span>
            {counts.completed > 0 && filter !== "completed" && (
              <button
                onClick={() => setFilter("completed")}
                className="text-primary-600 hover:text-primary-700 font-medium
                         hover:underline transition-colors"
              >
                View completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
