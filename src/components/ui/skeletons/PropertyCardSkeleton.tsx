'use client';

const PropertiesCardSkeleton = () => (
  <div className="bg-dozebg1 max-w-6xl rounded-xl mx-1 m-2 md:mx-2 shadow-md overflow-hidden p-4 flex flex-col md:flex-row gap-4 animate-pulse">
    {/* Media Skeleton */}
    <div className="flex flex-col w-full md:w-[330px] gap-2 md:h-full">
      {/* Desktop Thumbnails */}
      <div className="hidden md:flex gap-2 h-full">
        {/* Thumbnails */}
        <div className="flex flex-col rounded-xl gap-2 p-2 bg-gray-300/40">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative w-[70px] h-[55px] rounded-xl bg-gray-300"
            ></div>
          ))}
        </div>
        {/* Main Image */}
        <div className="relative flex-1 rounded-xl bg-gray-300"></div>
      </div>
      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-2">
        <div className="relative w-full h-[180px] rounded-xl bg-gray-300"></div>
        <div className="flex gap-2 p-2 bg-gray-300/40 rounded-xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative w-[80px] h-[54px] rounded-xl bg-gray-300"
            ></div>
          ))}
        </div>
      </div>
    </div>

    {/* Info + Actions */}
    <div className="flex flex-col md:flex-row flex-1 gap-4">
      {/* Info */}
      <div className="flex-1 bg-greenlight p-4 h-[270px] rounded-xl space-y-3">
        {/* Nombre */}
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        {/* Dirección */}
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        {/* Zona */}
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
          ))}
          <div className="w-8 h-4 bg-gray-300 rounded ml-2"></div>
        </div>
        {/* Descripción */}
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="md:w-[220px] bg-[#e6e4ff] rounded-xl flex flex-col items-center md:items-end gap-4 p-4">
        {/* Métodos de contacto */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-300 rounded w-1/2"></div>
          ))}
        </div>
        {/* Habitaciones y botón */}
        <div className="flex flex-col items-center md:items-end w-full gap-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export default PropertiesCardSkeleton;
