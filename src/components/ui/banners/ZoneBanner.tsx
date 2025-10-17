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
  className?: string;
  mapClassName?: string;
}

export default function ZoneBanner({
  zoneCoordinates,
  pointsCoordinates,
  className = '',
  mapClassName,
}: ZoneBannerProps) {
  const initialCenter = zoneCoordinates[0];
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(initialCenter);
  const [mapZoom, setMapZoom] = useState(13);

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-[#0f172a] dark:via-[#0a1120] dark:to-[#020617] rounded-2xl shadow-md dark:shadow-[0_25px_55px_rgba(1,8,28,0.55)] overflow-hidden ${className}`}
    >
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
          className={mapClassName}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 via-black/10 to-transparent dark:from-black/60 dark:via-black/40" />
      </motion.div>
    </div>
  );
}
