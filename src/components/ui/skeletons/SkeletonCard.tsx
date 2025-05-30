const SkeletonZoneCard = () => (
  <div className="relative w-full max-w-sm bg-greenlight shadow-xl px-2 sm:px-3 transition-all text-center m-1 rounded-2xl overflow-hidden flex flex-col">
    {/* Skeleton Header */}
    <div className="flex justify-between items-center px-4 py-4">
      <div className="h-6 bg-gray-300 rounded w-1/3 animate-shimmer"></div>
      <div className="w-[110px] h-9 bg-gray-300 rounded-full animate-shimmer"></div>
    </div>

    {/* Skeleton Media */}
    <div className="relative w-full h-[220px] sm:h-[250px] mx-auto shadow-md overflow-hidden rounded-t-2xl mb-4">
      <div className="absolute inset-0 bg-gray-300 animate-shimmer"></div>
    </div>

    {/* Skeleton Footer */}
    <div className="bg-dozebg1 mt-1 mb-4 px-4 shadow-md rounded-b-lg">
      {/* Thumbnails */}
      <div className="flex overflow-x-auto gap-2 pt-2 scrollbar-hide">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative w-20 h-14 bg-gray-300 rounded-md animate-shimmer"
          ></div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-2 pb-4">
        <div className="bg-gray-300 rounded w-full h-9 animate-shimmer"></div>
      </div>
    </div>
  </div>
);

export default SkeletonZoneCard;
