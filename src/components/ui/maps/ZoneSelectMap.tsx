'use client';

import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parseAreaToCoordinates } from '@/utils/mapUtils/parseAreaToCoordiantes';
import type { Zone } from '@/types/zone';

interface Props {
  zones: Zone[];
  onZoneSelect: (zoneId: number) => void;
  selectedZoneId?: number | null;
}

export default function ZoneSelectMap({
  zones,
  onZoneSelect,
  selectedZoneId,
}: Props) {
  const center: LatLngExpression = [46.98, 4.98];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      className="h-[500px] w-full rounded-xl z-10"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {zones.map((zone) => {
        const coords = parseAreaToCoordinates(zone.area);
        const isSelected = selectedZoneId === zone.id;

        return (
          <Polygon
            key={zone.id}
            positions={coords}
            pathOptions={{
              color: isSelected ? '#2563EB' : '#666666',
              fillColor: isSelected ? '#3B82F6' : '#9CA3AF',
              fillOpacity: 0.3,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{
              click: () => onZoneSelect(zone.id),
            }}
          >
            <Tooltip sticky>{zone.name}</Tooltip>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}
