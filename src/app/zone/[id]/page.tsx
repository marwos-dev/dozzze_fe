'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { getZoneById, setSelectedZone } from '@/store/zoneSlice';
import PropertiesCard from '@/components/ui/cards/PropertiesCard/ProperitesCard';
import ZoneBanner from '@/components/ui/banners/ZoneBanner';
import { parseAreaToCoordinates } from '@/utils/mapUtils/parseAreaToCoordiantes';
import { extractPoints } from '@/utils/mapUtils/extractPoints';
import { Property } from '@/types/property';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ZoneHeaderSkeleton from '@/components/ui/skeletons/ZoneHeaderSkeleton';
import ZoneBannerSkeleton from '@/components/ui/skeletons/ZoneBannerSkeleton';
import PropertiesCardSkeleton from '@/components/ui/skeletons/PropertyCardSkeleton';
interface PageProps {
  params: Promise<{ id: number }>;
}

export default function ZoneDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const {
    selectedZone,
    data: allZones,
    loading,
    error,
  } = useSelector((state: RootState) => state.zones);

  useEffect(() => {
    if (!selectedZone) {
      dispatch(getZoneById(id));
    }
  }, [id, dispatch, selectedZone]);

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZoneId = Number(e.target.value);
    dispatch(setSelectedZone(newZoneId));
    router.push(`/zone/${newZoneId}`);
  };

  if (loading || !selectedZone)
    return (
      <div className="md:full bg-dozebg2 mx-auto px-4 sm:px-6 py-6 space-y-6">
        <ZoneHeaderSkeleton />
        {/* Mapa mobile */}
        <div className="block sm:hidden">
          <ZoneBannerSkeleton height={180} />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Columna izquierda: propiedades */}
          <div className="w-full md:w-[65%] pr-1 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertiesCardSkeleton key={i} />
            ))}
          </div>
          {/* Mapa fijo en desktop */}
          <div className="hidden sm:block md:w-[35%] mt-2">
            <div className="sticky top-24">
              <ZoneBannerSkeleton height={620} />
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-lg text-red-600">
        Zona no encontrada
      </p>
    );

  const zoneCoordinates = parseAreaToCoordinates(selectedZone.area);
  const pointsCoordinates = extractPoints(selectedZone.properties);

  return (
    <div className="md:full bg-dozebg2 mx-auto px-4 sm:px-6 py-6">
      {/* Header con título, selector, descripción e imágenes */}
      <div className="mb-6 rounded-2xl md:ml-2  shadow-sm border border-gray-200 px-4 sm:px-6 py-5">
        {/* Título y selector con soporte de modo oscuro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-dozeblue">
            {selectedZone.name}
          </h1>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--foreground)] whitespace-nowrap">
              Podés cambiar de zona:
            </span>
            <select
              value={selectedZone.id}
              onChange={handleZoneChange}
              className="bg-white dark:bg-dozegray/10 text-dozeblue border border-dozeblue rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            >
              {allZones.map((zone) => (
                <option
                  key={zone.id}
                  value={zone.id}
                  className="text-[var(--foreground)]"
                >
                  {zone.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción con transición */}
        {selectedZone.description && (
          <div className="relative overflow-hidden transition-all duration-500 ease-in-out">
            <div
              className={`text-[var(--foreground)] text-[15px] leading-relaxed transition-all duration-500 ease-in-out ${
                isExpanded ? 'max-h-[1000px]' : 'max-h-[4.8em] line-clamp-2'
              }`}
            >
              {selectedZone.description}
            </div>

            {selectedZone.description.length > 250 && (
              <button
                onClick={toggleExpanded}
                className="mt-2 inline-block text-sm text-white bg-dozeblue hover:bg-blue-800 transition px-4 py-1.5 rounded-lg shadow"
              >
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>
        )}

        {/* Galería de imágenes */}
        {selectedZone.images && selectedZone.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto py-4">
            {selectedZone.images.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Zona ${selectedZone.name} imagen ${i + 1}`}
                width={160}
                height={112}
                className="w-40 h-28 object-cover rounded-xl border border-gray-300 shadow-sm"
              />
            ))}
          </div>
        )}
      </div>

      {/* Mapa visible solo en mobile */}
      <div className="block sm:hidden mb-3 mt-1 h-[180px] rounded-xl overflow-hidden shadow-md">
        <ZoneBanner
          zoneCoordinates={zoneCoordinates}
          pointsCoordinates={pointsCoordinates}
        />
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Columna izquierda: propiedades */}
        <div className="w-full md:w-[65%] pr-1 space-y-4 scroll-smooth snap-y snap-mandatory md:h-[80vh] md:overflow-y-auto">
          {selectedZone.properties?.length > 0 ? (
            selectedZone.properties.map((property: Property) => (
              <div
                key={property.id}
                id={`property-${property.id}`}
                className="snap-start scroll-mt-24"
              >
                <PropertiesCard {...property} />
              </div>
            ))
          ) : (
            <p className="text-dozegray text-center">
              No hay propiedades disponibles.
            </p>
          )}
        </div>

        {/* Mapa fijo en desktop */}
        <div className="hidden sm:block md:w-[35%] mt-2">
          <div className="sticky top-24 h-[620px] rounded-xl overflow-hidden shadow-lg">
            <ZoneBanner
              zoneCoordinates={zoneCoordinates}
              pointsCoordinates={pointsCoordinates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
