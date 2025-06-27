'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Minimize, Expand } from 'lucide-react';
import type { LatLngExpression } from 'leaflet';
import type { PointWithMedia } from '@/types/map';
import ImageGalleryModal from '@/components/ui/modals/ImageGaleryModal';

const MapView = dynamic(() => import('../../maps/MapZoneVIew'), { ssr: false });
const MapModal = dynamic(() => import('../../maps/MapModal'), { ssr: false });

const fallbackImage = '/logo.png';

interface ZoneCardMediaProps {
  showMap: boolean;
  selectedImage: string;
  imageUrls: string[];
  zoneCoordinates: LatLngExpression[];
  pointsCoordinates: PointWithMedia[];
  showOverlayMap: boolean;
  setShowOverlayMap: (value: boolean) => void;
  cardHeight: number;
  mapCenter: LatLngExpression;
  mapZoom: number;
  setMapCenter: (center: LatLngExpression) => void;
  setMapZoom: (zoom: number) => void;
}

export default function ZoneCardMedia({
  showMap,
  selectedImage,
  zoneCoordinates,
  pointsCoordinates,
  showOverlayMap,
  setShowOverlayMap,
  mapCenter,
  mapZoom,
  setMapCenter,
  setMapZoom,
  imageUrls,
}: ZoneCardMediaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const openMapModal = () => setIsModalOpen(true);
  const closeMapModal = () => setIsModalOpen(false);
  const handleExpand = () => setShowOverlayMap(true);
  const handleCollapse = () => setShowOverlayMap(false);

  const isValidImage =
    typeof selectedImage === 'string' &&
    selectedImage.trim().length > 10 &&
    selectedImage.startsWith('http');

  const imageToRender = isValidImage ? selectedImage : fallbackImage;
  const selectedIndex = imageUrls.findIndex((url) => url === selectedImage);

  return (
    <>
      <motion.div
        className="relative w-full h-[220px] sm:h-[250px] mx-auto shadow-md overflow-hidden rounded-t-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {showMap ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <MapView
                zoneCoordinates={zoneCoordinates}
                pointsCoordinates={pointsCoordinates}
                center={mapCenter}
                zoom={mapZoom}
                onCenterChange={setMapCenter}
                onZoomChange={setMapZoom}
              />
              <button
                onClick={handleExpand}
                className="absolute bottom-1 right-1 bg-dozeblue text-white px-2 py-1 rounded shadow-md hover:bg-opacity-90 flex items-center gap-1 text-xs z-10"
              >
                <Expand className="w-4 h-4" />
                Expandir
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={imageToRender}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={imageToRender}
                alt="Imagen de la zona"
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                placeholder="empty"
                className="object-cover cursor-pointer"
                onClick={() => setIsGalleryOpen(true)}
                priority
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <MapModal
        isOpen={isModalOpen}
        onClose={closeMapModal}
        zoneCoordinates={zoneCoordinates}
        pointsCoordinates={pointsCoordinates}
        center={mapCenter}
        zoom={mapZoom}
        onCenterChange={setMapCenter}
        onZoomChange={setMapZoom}
      />

      {showOverlayMap && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-30 bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          <MapView
            zoneCoordinates={zoneCoordinates}
            pointsCoordinates={pointsCoordinates}
            center={mapCenter}
            zoom={mapZoom}
            onCenterChange={setMapCenter}
            onZoomChange={setMapZoom}
          />

          <div className="absolute top-2 right-2 flex gap-2 z-50">
            <button
              onClick={handleCollapse}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
              title="Cerrar vista expandida"
            >
              <Minimize className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={openMapModal}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
              title="Pantalla completa"
            >
              <Maximize className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </motion.div>
      )}

      {isGalleryOpen && (
        <ImageGalleryModal
          images={imageUrls}
          initialIndex={selectedIndex >= 0 ? selectedIndex : 0}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </>
  );
}
