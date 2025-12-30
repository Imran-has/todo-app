"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, getBearerToken } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import type { Task, TaskListResponse, TaskCreate } from "@/types/task";

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const fetchTasks = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const token = getBearerToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      const completedParam =
        filter === "all" ? undefined : filter === "completed";
      const endpoint =
        completedParam !== undefined
          ? `/api/${session.user.id}/tasks?completed=${completedParam}`
          : `/api/${session.user.id}/tasks`;

      const data = await apiRequest<TaskListResponse>(endpoint, {
        token,
      });
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [session, filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id || !newTaskTitle.trim()) return;

    try {
      const token = getBearerToken();
      if (!token) return;

      const taskData: TaskCreate = { title: newTaskTitle.trim() };
      await apiRequest<Task>(`/api/${session.user.id}/tasks`, {
        method: "POST",
        body: taskData,
        token,
      });
      setNewTaskTitle("");
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  }

  async function handleToggleComplete(task: Task) {
    if (!session?.user?.id) return;

    try {
      const token = getBearerToken();
      if (!token) return;

      const action = task.completed ? "incomplete" : "complete";
      await apiRequest<Task>(
        `/api/${session.user.id}/tasks/${task.id}/${action}`,
        {
          method: "PATCH",
          token,
        }
      );
      fetchTasks();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update task"
      );
    }
  }

  async function handleDeleteTask(taskId: number) {
    if (!session?.user?.id) return;

    try {
      const token = getBearerToken();
      if (!token) return;

      await apiRequest(`/api/${session.user.id}/tasks/${taskId}`, {
        method: "DELETE",
        token,
      });
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  if (loading && tasks.length === 0) {
    return <div className="text-center text-gray-500">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateTask} className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Add Task
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-800 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === "active"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {tasks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tasks yet. Add one above!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 flex items-center gap-4 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p
                  className={`${
                    task.completed ? "line-through text-gray-400" : "text-gray-900"
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
