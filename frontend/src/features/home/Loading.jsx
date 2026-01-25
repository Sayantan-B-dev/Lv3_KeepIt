import React from "react";

export const UserBoxSkeleton = ({ count = 6 }) => (
  <div className="w-full flex flex-wrap justify-center sm:justify-start gap-4 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="
          flex
          rounded-xl
          border border-muted
          bg-type-1 
          p-4
          min-w-[140px]
          w-full sm:w-auto
          h-20
          relative overflow-hidden
        "
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="w-12 h-12 rounded-full bg-type-2 border border-muted shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-24 rounded bg-type-2" />
            <div className="h-3 w-16 rounded bg-type-2 opacity-50" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Loading = () => {
  return (
    <div className="w-full px-4 py-6 flex justify-center">
      <div className="w-full flex flex-col gap-6 animate-pulse">

        {/* Header skeleton */}
        <div className="relative w-full p-6 rounded-xl border border-muted glass-panel overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.2s_infinite]" />

          <div className="flex flex-col items-center gap-4">
            {/* avatar */}
            <div className="w-16 h-16 rounded-full bg-type-1 border border-muted" />

            {/* username */}
            <div className="w-40 h-4 rounded-full bg-type-1 border border-muted" />

            {/* title */}
            <div className="w-full max-w-xl h-6 rounded-full bg-type-1 border border-muted mt-2" />
          </div>
        </div>

        {/* Meta row */}
        <div className="flex justify-between items-center gap-4 px-2">
          <div className="w-48 h-4 rounded-full bg-type-1 border border-muted" />
          <div className="w-8 h-8 rounded-full bg-type-1 border border-muted" />
        </div>

        {/* UserBox area loading */}
        <UserBoxSkeleton count={12} />

        {/* Content skeleton */}
        <div className="relative w-full p-6 rounded-xl border border-muted glass-panel overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.2s_infinite]" />

          <div className="flex flex-col gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 rounded-full bg-type-1 border border-muted ${i % 3 === 0 ? "w-full" : "w-[85%]"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
