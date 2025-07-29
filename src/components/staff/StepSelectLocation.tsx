'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Props {
  data: {
    latitude: number | null;
    longitude: number | null;
    address?: string;
  };
  onChange: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
}

// Necesario para íconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

function LocationSelector({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function StepSelectLocation({
  data,
  onChange,
  onBack,
  onNext,
}: Props) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.6, -58.45]);

  useEffect(() => {
    if (!data.latitude || !data.longitude) {
    } else {
      setMapCenter([data.latitude, data.longitude]);
    }
  }, [data.latitude, data.longitude, data.address]);

  const handleSetCoords = (lat: number, lng: number) => {
    onChange({ ...data, latitude: lat, longitude: lng });
  };

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-dozeblue">Paso 2: Ubicación</h2>
      <p className="text-sm text-gray-600 dark:text-white/60">
        Hacé clic en el mapa para seleccionar la ubicación de la propiedad.
      </p>

      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.latitude && data.longitude && (
            <Marker position={[data.latitude, data.longitude]} />
          )}
          <LocationSelector onChange={handleSetCoords} />
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
