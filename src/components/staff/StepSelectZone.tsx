'use client';

import { useState } from 'react';
import type { Zone } from '@/types/zone';
import type { PropertyFormData } from '@/types/property';
import MapView from '@/components/ui/maps/MapZoneVIew';
import { parseAreaToCoordinates } from '@/utils/mapUtils/parseAreaToCoordiantes';

interface Props {
  zones: Zone[];
  data: PropertyFormData;
  onChange: (data: PropertyFormData) => void;
  onNext: () => void;
  returnOnlyId?: boolean;
}

export default function StepSelectZone({
  zones,
  data,
  onChange,
  onNext,
  returnOnlyId = false,
}: Props) {
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(
    data.zone_id ?? null
  );

  const handleSelect = (zone: Zone) => {
    setSelectedZoneId(zone.id);

    if (returnOnlyId) {
      onChange({
        ...data,
        zone_id: zone.id,
      });
    } else {
      onChange({
        ...data,
        zone_id: zone.id,
        zone: zone.name,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Seleccioná una zona
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const coords = parseAreaToCoordinates(zone.area);
          const isSelected = selectedZoneId === zone.id;

          return (
            <div
              key={zone.id}
              onClick={() => handleSelect(zone)}
              className={`cursor-pointer rounded-xl border transition overflow-hidden bg-white dark:bg-dozegray/10 ${
                isSelected ? 'border-dozeblue shadow-lg' : 'border-gray-200'
              }`}
            >
              <div className="p-4 flex items-center justify-between">
                <h3 className="text-md font-medium">{zone.name}</h3>
                {isSelected && (
                  <span className="text-dozeblue text-sm font-semibold">
                    Seleccionada
                  </span>
                )}
              </div>

              <div className="h-[250px]">
                <MapView
                  zoneCoordinates={coords}
                  pointsCoordinates={[]}
                  center={coords[0]}
                  zoom={13}
                  onCenterChange={() => {}}
                  onZoomChange={() => {}}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={selectedZoneId === null}
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
