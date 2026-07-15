import React from "react";

const SeriesSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 pt-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-lg bg-gray-50 shadow-sm"
        >
          <div className="aspect-4/3 w-full bg-gray-200 animate-pulse" />

          <div className="p-6">
            <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-gray-200 animate-pulse" />
            </div>

            <div className="mt-4 flex items-center">
              <div className="h-8 w-28 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeriesSkeleton;
