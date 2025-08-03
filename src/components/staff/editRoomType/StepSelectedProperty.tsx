'use client';

import PropertiesCard from '@/components/ui/cards/PropertiesCard/ProperitesCard';
import { Zone } from '@/types/zone';

interface Props {
  zone: Zone;
  onSelectProperty: (propertyId: number) => void;
}

export default function StepSelectedProperty({
  zone,
  onSelectProperty,
}: Props) {
  const properties = zone.properties || [];

  return (
    <div className="px-4 sm:px-6 py-6">
      <h2 className="text-xl font-semibold mb-4 text-dozeblue">
        Propiedades en {zone.name}
      </h2>

      {properties.length === 0 ? (
        <p className="text-dozegray text-center mt-10">
          No hay propiedades disponibles en esta zona.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property) => (
            <PropertiesCard
              key={property.id}
              {...property}
              onClick={() => onSelectProperty(property.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
