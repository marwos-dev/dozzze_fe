'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { MapPin } from 'lucide-react';

export default function PropertyDetailPage() {
  const property = useSelector(
    (state: RootState) => state.properties.selectedProperty
  );

  if (!property)
    return <p className="text-center py-10">Cargando propiedad...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">
        {property.name}
      </h1>
      <p className="text-sm text-gray-600 flex items-center gap-1 mb-6">
        <MapPin className="w-4 h-4" />
        {property.address || 'Dirección no disponible'}
      </p>

      <div className="grid gap-4">
        {property.room_types.map((room) => (
          <div
            key={room.id}
            className="border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-white dark:bg-dozebg1 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-dozeblue">
                  {room.name}
                </h3>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Tipo de alojamiento
                </span>
              </div>
              <button className="text-sm text-dozeblue underline hover:text-dozeblue/80">
                Ver disponibilidad
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
