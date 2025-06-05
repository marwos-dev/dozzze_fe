'use client';

const PropertyBannerSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {/* Banner */}
    <div className="flex flex-col md:flex-row bg-dozebg1 rounded-t-2xl overflow-hidden shadow-lg mb-2 border border-gray-200">
      {/* Imagen principal + thumbnails */}
      <div className="relative w-full md:w-[45%] h-[280px] md:h-auto bg-gray-300">
        <div className="absolute bottom-2 left-2 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-[60px] h-[45px] rounded-md bg-gray-200 border-2 border-white"
            ></div>
          ))}
        </div>
      </div>

      {/* Info derecha */}
      <div className="flex flex-col justify-between p-6 flex-1 gap-6">
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-300 rounded" />
          <div className="h-4 w-1/2 bg-gray-300 rounded" />
          <div className="h-3 w-1/4 bg-gray-300 rounded" />
          <div className="h-3 w-1/2 bg-gray-300 rounded" />

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-300 rounded" />
            ))}
            <div className="w-8 h-4 bg-gray-300 rounded ml-2"></div>
          </div>

          {/* Descripción */}
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-6 w-28 bg-gray-300 rounded-full"></div>
            ))}
          </div>
          <div className="h-8 w-48 bg-gray-300 rounded-full mt-2 md:mt-0"></div>
        </div>
      </div>
    </div>

    {/* Filtros */}
    <div className="bg-white rounded-b-2xl shadow-md border border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-start">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full sm:w-[160px] space-y-2">
            <div className="h-3 w-2/3 bg-gray-300 rounded" />
            <div className="h-8 w-full bg-gray-300 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PropertyBannerSkeleton;
