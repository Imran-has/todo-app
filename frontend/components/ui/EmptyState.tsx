"use client";

import { ClipboardListIcon, SparklesIcon, RocketIcon } from "./Icons";

interface EmptyStateProps {
  filter: "all" | "active" | "completed";
}

export function EmptyState({ filter }: EmptyStateProps) {
  const content = {
    all: {
      icon: ClipboardListIcon,
      title: "No tasks yet",
      description: "Start by adding your first task above. Stay organized and productive!",
      gradient: "from-primary-500 to-primary-600",
    },
    active: {
      icon: SparklesIcon,
      title: "All caught up!",
      description: "You've completed all your tasks. Take a moment to celebrate!",
      gradient: "from-success-500 to-success-600",
    },
    completed: {
      icon: RocketIcon,
      title: "No completed tasks",
      description: "Complete some tasks to see them here. You've got this!",
      gradient: "from-accent-500 to-primary-500",
    },
  };

  const { icon: Icon, title, description, gradient } = content[filter];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Decorative background */}
      <div className="relative mb-6">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 blur-2xl rounded-full scale-150`}
        />
        <div
          className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient}
                      flex items-center justify-center shadow-soft-lg`}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-sm leading-relaxed">
        {description}
      </p>

      {filter === "all" && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
          <span>Tip: Press Enter to quickly add a task</span>
        </div>
      )}
    </div>
  );
}
