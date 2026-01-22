import React from "react";


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

        {/* Tags */}
        <div className="flex flex-wrap gap-2 px-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-20 h-6 rounded-full bg-type-1 border border-muted"
            />
          ))}
        </div>
        {/* Navigation skeleton */}
        {/* <div className="flex justify-center gap-3 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-14 h-10 rounded-lg bg-type-1 border border-muted"
            />
          ))}
        </div> */}

        {/* Content skeleton */}
        <div className="relative w-full p-6 rounded-xl border border-muted glass-panel overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.2s_infinite]" />

          <div className="flex flex-col gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 rounded-full bg-type-1 border border-muted ${
                  i % 3 === 0 ? "w-full" : "w-[85%]"
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
