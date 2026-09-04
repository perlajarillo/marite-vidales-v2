import type { FC } from "react";

type ReviewsSkeletonProps = {
  count?: number;
};

const ReviewsSkeleton: FC<ReviewsSkeletonProps> = ({ count = 3 }) => {
  return (
    <div
      className="min-h-screen p-4"
      aria-busy="true"
      aria-label="Loading reviews"
    >
      <div className="mx-auto max-w-4xl space-y-2 sm:space-y-4">
        <div className="mb-4 w-full pt-5 lg:float-left lg:mb-6 lg:mr-16 lg:w-72">
          <div className="aspect-4/3 w-full animate-pulse rounded-md bg-stone-200" />
        </div>

        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="mx-auto border-b border-stone-200 py-4 last:border-b-0 pl-85"
          >
            <div className="space-y-2 pt-2" aria-hidden="true">
              <div className="h-3 w-full animate-pulse rounded bg-stone-200" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-stone-200" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-stone-200" />
            </div>
            <div className="mt-4 space-y-2 sm:text-left" aria-hidden="true">
              <div className="ml-auto h-4 w-32 animate-pulse rounded bg-stone-200 sm:ml-0" />
              <div className="ml-auto h-3 w-24 animate-pulse rounded bg-stone-200 sm:ml-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSkeleton;
