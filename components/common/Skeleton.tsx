"use client";

// Single shimmer line
function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
    />
  );
}

// Stat Card Skeleton (Dashboard ke liye)
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <SkeletonLine className="h-3.5 w-24" />
          <SkeletonLine className="h-8 w-12" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
      </div>
    </div>
  );
}

// Table Row Skeleton (Tasks / Users table ke liye)
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-5 py-3.5">
                <SkeletonLine className="h-3.5 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="bg-white dark:bg-gray-900">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <td key={colIdx} className="px-5 py-4">
                  <SkeletonLine className={`h-4 ${colIdx === 0 ? "w-36" : "w-20"}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Card Grid Skeleton (Dashboard recent tasks ke liye)
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm space-y-3"
        >
          <div className="flex justify-between">
            <SkeletonLine className="h-4 w-40" />
            <SkeletonLine className="h-5 w-14 rounded-full" />
          </div>
          <SkeletonLine className="h-3.5 w-full" />
          <SkeletonLine className="h-3.5 w-3/4" />
          <div className="flex justify-between pt-1">
            <SkeletonLine className="h-5 w-20 rounded-full" />
            <SkeletonLine className="h-3.5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
