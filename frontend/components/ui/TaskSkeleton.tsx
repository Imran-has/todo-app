"use client";

export function TaskSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="task-card animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-start gap-4">
            {/* Checkbox skeleton */}
            <div className="w-6 h-6 rounded-lg skeleton" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              <div className="h-5 skeleton w-3/4 rounded-md" />
              <div className="h-4 skeleton w-1/2 rounded-md" />
              <div className="h-3 skeleton w-20 rounded-md" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-2">
              <div className="w-8 h-8 skeleton rounded-lg" />
              <div className="w-8 h-8 skeleton rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
