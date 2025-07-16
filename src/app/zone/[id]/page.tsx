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
  const [mainImage, setMainImage] = useState<string | null>(null);

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

  useEffect(() => {
    if (selectedZone?.images?.length) {
      setMainImage(selectedZone.images[0]);
    }
  }, [selectedZone]);

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZoneId = Number(e.target.value);
    dispatch(setSelectedZone(newZoneId));
    router.push(`/zone/${newZoneId}`);
  };

  if (loading || !selectedZone)
    return (
      <div className="md:full bg-dozebg2 mx-auto px-4 sm:px-6 py-6 space-y-6">
        <ZoneHeaderSkeleton />
        <div className="block sm:hidden">
          <ZoneBannerSkeleton height={180} />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-6">
          <div className="w-full md:w-[65%] pr-1 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertiesCardSkeleton key={i} />
            ))}
          </div>
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

  const coverImage = selectedZone.images?.[0] || '/logo.png';
  const galleryImages = selectedZone.images?.slice(1) || [];

  return (
    <div className="md:full bg-dozebg2 mx-auto px-4 sm:px-6 py-2">
      {/* Encabezado compacto más centrado */}
      <div className="z-10 relative mt-6 mb-6 px-2 md:px-4">
        <div className="bg-white/80 backdrop-blur-md border border-dozeblue/20 rounded-2xl px-6 py-4 shadow-md max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <h1 className="text-xl md:text-2xl pl-10 font-bold text-dozeblue">
            {selectedZone.name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-dozegray">Zona:</span>
            <select
              value={selectedZone.id}
              onChange={handleZoneChange}
              className="bg-white border mr-20 pr-3 border-dozeblue/30 text-dozeblue text-sm rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-dozeblue"
            >
              {allZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Imagen principal y miniaturas */}
      <div className="mb-6 md:ml-2 flex flex-col md:flex-row gap-4 relative rounded-2xl overflow-hidden shadow">
        {/* Imagen principal */}
        <div className="relative w-full md:w-[75%] h-[340px] md:h-[360px]">
          <Image
            src={mainImage || coverImage}
            alt={`Imagen principal de ${selectedZone.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 75vw"
            priority
            unoptimized
          />

          {/* Gradiente oscuro inferior */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10" />

          {/* Descripción sobre la imagen */}
          {selectedZone.description && (
            <div className="absolute bottom-4 left-4 z-20 max-w-xl text-white text-sm rounded-xl px-4 py-3 shadow-md">
              <p className={isExpanded ? '' : 'line-clamp-3'}>
                {selectedZone.description}
              </p>
              {selectedZone.description.length > 250 && (
                <button
                  onClick={toggleExpanded}
                  className="mt-2 text-xs text-white border border-white/50 hover:bg-white hover:text-dozeblue transition px-3 py-1 rounded-lg"
                >
                  {isExpanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Miniaturas con fondo blanco alineado */}
        {galleryImages.length > 0 && (
          <div className="hidden md:flex w-[25%]">
            <div className="relative flex flex-col gap-2 w-full p-2 pr-3 overflow-y-auto max-h-[360px] scroll-smooth bg-white/70 backdrop-blur-sm rounded-xl">
              {/* Gradiente arriba */}
              <div className="absolute top-0  left-0 w-full h-6 from-dozebg2 to-transparent z-10 pointer-events-none" />

              {/* Miniaturas */}
              <div className="relative z-20 flex flex-col gap-2">
                {galleryImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(src)}
                    className="relative w-full h-[80px] rounded-xl overflow-hidden border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-dozeblue"
                  >
                    <Image
                      src={src}
                      alt={`Miniatura ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                      unoptimized
                    />
                  </button>
                ))}
              </div>

              {/* Gradiente abajo */}
              <div className="absolute bottom-0 left-0 w-full h-6 from-dozebg2 to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Mapa en mobile */}
      <div className="block sm:hidden mb-3 mt-1 h-[180px] rounded-xl overflow-hidden shadow-md">
        <ZoneBanner
          zoneCoordinates={zoneCoordinates}
          pointsCoordinates={pointsCoordinates}
        />
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Propiedades */}
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
