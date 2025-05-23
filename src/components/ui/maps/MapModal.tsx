"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import type { PointWithMedia } from "@/types/map";

const MapView = dynamic(() => import("./MapZoneVIew"), { ssr: false });

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  zoneCoordinates: LatLngExpression[];
  pointsCoordinates: PointWithMedia[];
  center: LatLngExpression;
  zoom: number;
  onCenterChange: (center: LatLngExpression) => void;
  onZoomChange: (zoom: number) => void;
}

export default function MapModal({
  isOpen,
  onClose,
  zoneCoordinates,
  pointsCoordinates,
  center,
  zoom,
  onCenterChange,
  onZoomChange,
}: MapModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full h-full max-w-6xl max-h-[90vh] rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <MapView
          zoneCoordinates={zoneCoordinates}
          pointsCoordinates={pointsCoordinates}
          center={center}
          zoom={zoom}
          onCenterChange={onCenterChange}
          onZoomChange={onZoomChange}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full z-10"
        >
          Cerrar
        </button>
      </div>
    </div>,
    document.body
  );
}
