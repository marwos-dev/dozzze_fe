const PropertiesCardSkeleton = () => (
  <div className="bg-dozebg1 max-w-6xl rounded-xl mx-1 m-2 md:mx-2 shadow-md overflow-hidden p-4 flex flex-col md:flex-row gap-4 animate-pulse">
    {/* Imagen */}
    <div className="rounded-xl bg-gray-300 w-full md:w-64 h-48 md:h-auto"></div>

    {/* Contenido principal */}
    <div className="flex flex-col md:flex-row flex-1 gap-4">
      <div className="flex-1 space-y-3 py-1">
        {/* Nombre */}
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        {/* Dirección */}
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        {/* Zona */}
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        {/* Descripción (varios bloques) */}
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>

      {/* Columna de acciones */}
      <div className="md:w-[220px] space-y-4 py-1">
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

export default PropertiesCardSkeleton;
