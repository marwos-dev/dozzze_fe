'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { LatLngExpression } from 'leaflet';
import type { PointWithMedia } from '@/types/map';
import { motion } from 'framer-motion';

const MapView = dynamic(() => import('../maps/MapZoneVIew'), { ssr: false });

interface ZoneBannerProps {
  zoneCoordinates: LatLngExpression[];
  pointsCoordinates: PointWithMedia[];
}

export default function ZoneBanner({
  zoneCoordinates,
  pointsCoordinates,
}: ZoneBannerProps) {
  const initialCenter = zoneCoordinates[0];
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(initialCenter);
  const [mapZoom, setMapZoom] = useState(13);

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-xl shadow-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-full"
      >
        <MapView
          zoneCoordinates={zoneCoordinates}
          pointsCoordinates={pointsCoordinates}
          center={mapCenter}
          zoom={mapZoom}
          onCenterChange={setMapCenter}
          onZoomChange={setMapZoom}
        />
      </motion.div>
    </div>
  );
}
