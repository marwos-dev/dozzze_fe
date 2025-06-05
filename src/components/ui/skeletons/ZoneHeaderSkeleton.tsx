'use client';

const ZoneHeaderSkeleton = () => (
  <div className="mb-6 rounded-2xl md:ml-2 bg-white shadow-sm border border-gray-200 px-4 sm:px-6 py-5 animate-pulse space-y-4">
    {/* Título y selector */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
      <div className="h-10 w-40 bg-gray-300 rounded"></div>
    </div>

    {/* Descripción */}
    <div className="space-y-2">
      <div className="h-4 w-full bg-gray-300 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
    </div>

    {/* Galería */}
    <div className="flex gap-3 overflow-x-auto py-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-40 h-28 rounded-xl bg-gray-300"></div>
      ))}
    </div>
  </div>
);

export default ZoneHeaderSkeleton;
