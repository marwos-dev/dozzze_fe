'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { PropertyFormData } from '@/types/property';
import { Zone } from '@/types/zone';

// Fix Leaflet default icons for Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'icons/pin.svg',
});

interface Props {
  data: PropertyFormData;
  onChange: (partialData: Partial<PropertyFormData>) => void;
  onBack: () => void;
  onNext: () => void;
  zones: Zone[];
  zonePolygon: [number, number][];
}

// Verifica si un punto está dentro de un polígono
function pointInPolygon(point: [number, number], polygon: [number, number][]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1],
      yi = polygon[i][0];
    const xj = polygon[j][1],
      yj = polygon[j][0];

    const intersect =
      yi > point[0] !== yj > point[0] &&
      point[1] < ((xj - xi) * (point[0] - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Componente para centrar el mapa en los bounds del polígono
function MapBoundsHandler({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, bounds]);
  return null;
}

// Componente que maneja los clics del usuario
function LocationSelector({
  polygon,
  onChange,
}: {
  polygon: [number, number][];
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (pointInPolygon([lat, lng], polygon)) {
        onChange(lat, lng);
      } else {
        alert('El punto debe estar dentro de la zona seleccionada.');
      }
    },
  });
  return null;
}

export default function StepSelectLocation({
  data,
  onChange,
  onBack,
  onNext,
  zonePolygon,
}: Props) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.6, -58.45]);

  const polygonBounds = useMemo(() => {
    return L.latLngBounds(zonePolygon.map(([lat, lng]) => L.latLng(lat, lng)));
  }, [zonePolygon]);

  useEffect(() => {
    if (zonePolygon.length > 0) {
      const center = polygonBounds.getCenter();
      setMapCenter([center.lat, center.lng]);
    }
  }, [polygonBounds, zonePolygon]);

  const handleSetCoords = (lat: number, lng: number) => {
    onChange({ latitude: lat, longitude: lng });
  };

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-dozeblue">Paso 3: Ubicación</h2>
      <p className="text-sm text-gray-600 dark:text-white/60">
        Hacé clic dentro de la zona para indicar la ubicación exacta de la
        propiedad.
      </p>

      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer center={mapCenter} zoom={15} className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zonePolygon.length > 0 && (
            <>
              <Polygon
                positions={zonePolygon}
                pathOptions={{ color: '#2563EB', fillOpacity: 0.15 }}
              />
              <MapBoundsHandler bounds={polygonBounds} />
              <LocationSelector
                polygon={zonePolygon}
                onChange={handleSetCoords}
              />
            </>
          )}

          {data.latitude && data.longitude && (
            <Marker position={[data.latitude, data.longitude]} />
          )}
        </MapContainer>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="bg-gray-200 dark:bg-dozegray px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-dozegray/50 transition"
        >
          Volver
        </button>
        <button
          onClick={onNext}
          disabled={!data.latitude || !data.longitude}
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
