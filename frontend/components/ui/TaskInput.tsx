"use client";

import { useState, useRef, useEffect } from "react";
import { PlusIcon, FlagIcon, CalendarIcon } from "./Icons";
import type { Priority } from "@/types/task";

interface TaskInputProps {
  onSubmit: (title: string, description?: string, priority?: Priority, dueDate?: string) => Promise<void>;
  isSubmitting?: boolean;
}

const priorityOptions: { key: Priority; label: string; color: string }[] = [
  { key: "low", label: "Low", color: "text-green-500" },
  { key: "medium", label: "Medium", color: "text-yellow-500" },
  { key: "high", label: "High", color: "text-red-500" },
];

export function TaskInput({ onSubmit, isSubmitting = false }: TaskInputProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input on "/" key press (when not in an input)
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(
          (e.target as HTMLElement).tagName
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit(
      title.trim(),
      description.trim() || undefined,
      priority,
      dueDate || undefined
    );
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setIsExpanded(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsExpanded(false);
      setDescription("");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="relative"
    >
      <div
        className={`bg-white rounded-2xl border-2 transition-all duration-300 shadow-soft
          ${
            isExpanded
              ? "border-primary-300 shadow-soft-lg ring-4 ring-primary-500/10"
              : "border-slate-200 hover:border-slate-300"
          }`}
      >
        {/* Main input row */}
        <div className="flex items-center gap-3 p-4">
          <div
            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 border-dashed
              ${isExpanded ? "border-primary-300" : "border-slate-300"}
              transition-colors duration-200`}
          />
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task..."
            className="flex-1 text-base text-slate-800 placeholder:text-slate-400
                     bg-transparent border-none outline-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {/* Expanded section for description, priority, and due date */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 pt-0 border-t border-slate-100">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)..."
              className="w-full mt-3 p-3 text-sm text-slate-600 placeholder:text-slate-400
                       bg-slate-50 rounded-xl border border-slate-200
                       focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10
                       resize-none transition-all duration-200"
              rows={2}
              disabled={isSubmitting}
            />

            {/* Priority and Due Date row */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {/* Priority selector */}
              <div className="flex items-center gap-2">
                <FlagIcon className="w-4 h-4 text-slate-400" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="text-sm text-slate-600 bg-slate-50 border border-slate-200
                           rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary-300
                           focus:ring-2 focus:ring-primary-500/10"
                  disabled={isSubmitting}
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label} Priority
                    </option>
                  ))}
                </select>
              </div>

              {/* Due date picker */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-sm text-slate-600 bg-slate-50 border border-slate-200
                           rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary-300
                           focus:ring-2 focus:ring-primary-500/10"
                  disabled={isSubmitting}
                  min={new Date().toISOString().split("T")[0]}
                />
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate("")}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-slate-400">
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">Enter</kbd> to add
                {" "}or{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">Esc</kbd> to cancel
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setDescription("");
                  setPriority("medium");
                  setDueDate("");
                }}
                className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
              >
                Collapse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      {!isExpanded && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1.5 pointer-events-none mr-32">
          <kbd className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-mono rounded-md">
            /
          </kbd>
          <span className="text-xs text-slate-400">to focus</span>
        </div>
      )}
    </form>
  );
}
