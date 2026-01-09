"use client";

import { useState, useRef, useEffect } from "react";
import type { SortOption } from "@/types/task";
import { SortIcon, ChevronDownIcon } from "./Icons";

interface SortDropdownProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { key: SortOption; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "completed", label: "Completed first" },
  { key: "priority", label: "Priority" },
  { key: "due_date", label: "Due date" },
];

export function SortDropdown({ sort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = sortOptions.find((o) => o.key === sort)?.label || "Sort";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600
                   bg-white border border-slate-200 rounded-lg hover:bg-slate-50
                   hover:border-slate-300 transition-colors"
      >
        <SortIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200
                        rounded-lg shadow-lg z-10 py-1 animate-fade-in">
          {sortOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                onSortChange(key);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors
                ${sort === key
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
