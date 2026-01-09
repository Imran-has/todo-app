"use client";

import { useState } from "react";
import type { Task, Priority } from "@/types/task";
import { CheckIcon, TrashIcon, PencilIcon, CalendarIcon, FlagIcon } from "./Icons";

// Priority color styles
const priorityStyles: Record<Priority, { badge: string; flag: string }> = {
  high: {
    badge: "bg-red-100 text-red-700 border-red-200",
    flag: "text-red-500",
  },
  medium: {
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    flag: "text-yellow-500",
  },
  low: {
    badge: "bg-green-100 text-green-700 border-green-200",
    flag: "text-green-500",
  },
};

// Format due date for display
function formatDueDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Check if due date is overdue
function isOverdue(dateStr: string | null, completed: boolean): boolean {
  if (!dateStr || completed) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onEdit?: (task: Task, newTitle: string, newDescription?: string) => Promise<void>;
  index: number;
}

export function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  index,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(task);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (onEdit && editTitle.trim()) {
      await onEdit(task, editTitle.trim(), editDescription.trim() || undefined);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  // Stagger animation delay based on index
  const staggerDelay = Math.min(index * 50, 250);

  return (
    <div
      className={`task-card group animate-fade-in-up ${
        task.completed ? "task-card-completed" : ""
      } ${isDeleting ? "opacity-50 scale-95" : ""}`}
      style={{ animationDelay: `${staggerDelay}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`relative flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300
            ${
              task.completed
                ? "bg-gradient-to-br from-success-500 to-success-600 border-success-500"
                : "border-slate-300 hover:border-primary-400 bg-white"
            }
            ${isToggling ? "animate-pulse" : ""}
            focus:outline-none focus:ring-2 focus:ring-primary-500/30`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && (
            <CheckIcon className="w-4 h-4 text-white absolute top-0.5 left-0.5 animate-check" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-modern text-base font-medium"
                placeholder="Task title"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-modern text-sm resize-none"
                placeholder="Add a description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim()}
                  className="btn-primary text-sm py-1.5"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary text-sm py-1.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p
                className={`text-base font-medium leading-relaxed transition-all duration-300 ${
                  task.completed
                    ? "line-through text-slate-400"
                    : "text-slate-800"
                }`}
              >
                {task.title}
              </p>
              {task.description && (
                <p
                  className={`mt-1 text-sm leading-relaxed transition-all duration-300 ${
                    task.completed ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {task.description}
                </p>
              )}
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium
                    rounded-full border ${priorityStyles[task.priority].badge}`}
                >
                  <FlagIcon className={`w-3 h-3 ${priorityStyles[task.priority].flag}`} />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {/* Due Date */}
                {task.due_date && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium
                      rounded-full border ${
                        isOverdue(task.due_date, task.completed)
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                  >
                    <CalendarIcon className="w-3 h-3" />
                    {formatDueDate(task.due_date)}
                    {isOverdue(task.due_date, task.completed) && " (Overdue)"}
                  </span>
                )}

                {/* Created date */}
                <span className="text-xs text-slate-400">
                  Created{" "}
                  {new Date(task.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                {task.completed && (
                  <span className="badge badge-success text-xs">Completed</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && !task.completed && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-icon"
                aria-label="Edit task"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-icon-danger"
              aria-label="Delete task"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
