"use client";

type FilterType = "all" | "active" | "completed";

interface FilterPillsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts?: {
    all: number;
    active: number;
    completed: number;
  };
}

export function FilterPills({ filter, onFilterChange, counts }: FilterPillsProps) {
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="flex items-center gap-2">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`filter-pill ${
            filter === key ? "filter-pill-active" : "filter-pill-inactive"
          }`}
        >
          {label}
          {counts && (
            <span
              className={`ml-1.5 text-xs ${
                filter === key
                  ? "text-white/80"
                  : "text-slate-400"
              }`}
            >
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
