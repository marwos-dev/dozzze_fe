'use client';

const RoomCardSkeleton = () => (
  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white animate-pulse">
    {/* Imagen principal */}
    <div className="relative w-full h-[200px] bg-gray-300" />

    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 w-2/3 rounded" />
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-300 rounded" />
        <div className="h-3 w-1/2 bg-gray-300 rounded" />
      </div>

      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-3 w-full bg-gray-200 rounded" />
        ))}
      </div>

      <div className="h-8 bg-gray-300 rounded w-full mt-4" />
    </div>
  </div>
);

export default RoomCardSkeleton;
