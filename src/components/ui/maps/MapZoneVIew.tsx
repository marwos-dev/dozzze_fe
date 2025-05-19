"use client";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PointWithMedia } from "@/types/map";
import Image from "next/image";
import { useEffect } from "react";

interface MapViewProps {
  zoneCoordinates: LatLngExpression[];
  pointsCoordinates?: PointWithMedia[];
  center: LatLngExpression;
  zoom: number;
  onCenterChange: (center: LatLngExpression) => void;
  onZoomChange: (zoom: number) => void;
}

function TrackViewChanges({
  onCenterChange,
  onZoomChange,
}: Pick<MapViewProps, "onCenterChange" | "onZoomChange">) {
  useMapEvents({
    moveend(e) {
      onCenterChange(e.target.getCenter());
    },
    zoomend(e) {
      onZoomChange(e.target.getZoom());
    },
  });
  return null;
}

function SyncMapView({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    const newCenter = L.latLng(center);

    const latDiff = Math.abs(currentCenter.lat - newCenter.lat);
    const lngDiff = Math.abs(currentCenter.lng - newCenter.lng);
    const zoomDiff = Math.abs(currentZoom - zoom);

    const centerChanged = latDiff > 0.0001 || lngDiff > 0.0001;
    const zoomChanged = zoomDiff > 0;

    if (centerChanged || zoomChanged) {
      map.setView(newCenter, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

const gpsIcon = new L.Icon({
  iconUrl: "/icons/pin.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function MapZoneView({
  zoneCoordinates,
  pointsCoordinates = [],
  center,
  zoom = 10,
  onCenterChange,
  onZoomChange,
}: MapViewProps) {
  const handleMarkerClick = (id?: number) => {
    if (!id) return;
    const target = document.getElementById(`property-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-full w-full z-0 rounded"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polygon positions={zoneCoordinates} pathOptions={{ color: "#808080" }} />

      {pointsCoordinates.map((point, index) => (
        <Marker
          key={index}
          position={point.position}
          icon={gpsIcon}
          eventHandlers={{
            click: () => handleMarkerClick(point.id),
          }}
        >
          <Popup maxWidth={250}>
            <div className="w-[200px] space-y-2 text-center">
              <p className="text-sm font-semibold">{point.name}</p>

              {point.coverImage ? (
                <div className="relative w-full h-[120px] rounded overflow-hidden">
                  <Image
                    src={point.coverImage}
                    alt={`Imagen de ${point.name}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ) : (
                <div className="text-xs text-gray-500">Sin imagen</div>
              )}

              <div className="text-yellow-500 text-sm">★★★★★</div>
            </div>
          </Popup>
        </Marker>
      ))}

      <TrackViewChanges
        onCenterChange={onCenterChange}
        onZoomChange={onZoomChange}
      />
      <SyncMapView center={center} zoom={zoom} />
    </MapContainer>
  );
}
