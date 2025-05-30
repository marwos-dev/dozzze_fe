const SkeletonCard = () => (
  <div className="relative w-full max-w-sm bg-greenlight shadow-xl px-2 sm:px-3 transition-all text-center m-1 rounded-2xl overflow-hidden flex flex-col">
    {/* Header Skeleton */}
    <div className="py-3">
      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-shimmer mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/4 mx-auto animate-shimmer"></div>
    </div>

    {/* Media Skeleton */}
    <div className="relative h-40 bg-gray-300 rounded mb-4 overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
    </div>

    {/* Footer Skeleton */}
    <div className="flex justify-center space-x-2 pb-4">
      <div className="h-4 bg-gray-300 rounded w-1/4 animate-shimmer"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 animate-shimmer"></div>
    </div>
  </div>
);

export default SkeletonCard;
