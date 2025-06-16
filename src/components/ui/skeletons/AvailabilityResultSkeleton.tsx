'use client';

const SkeletonAvailabilityResult = () => {
  return (
    <div className="space-y-6 mt-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-300 dark:border-white/10 rounded-2xl bg-[var(--background)] shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr]">
            {/* Lado izquierdo (selector) */}
            <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dozegray/10 space-y-4">
              <div className="h-5 w-3/4 bg-gray-300 rounded animate-shimmer" />
              <div className="h-4 w-1/2 bg-gray-300 rounded animate-shimmer" />

              <div className="space-y-2">
                <div className="h-4 w-1/3 bg-gray-300 rounded animate-shimmer" />
                <div className="h-10 w-full bg-gray-300 rounded-md animate-shimmer" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-300 rounded animate-shimmer" />
                <div className="h-10 w-full bg-gray-300 rounded-md animate-shimmer" />
              </div>
            </div>

            {/* Lado derecho (contenido y botón) */}
            <div className="p-6 flex flex-col justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-6 w-24 bg-gray-300 rounded-full animate-shimmer"
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-6 w-32 bg-green-100 dark:bg-green-900 rounded-md animate-shimmer"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
                <div className="h-4 w-1/2 bg-gray-300 rounded animate-shimmer" />
                <div className="h-10 w-32 bg-gray-300 rounded-md animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonAvailabilityResult;
