'use client';

import { motion } from 'framer-motion';
import { Zone } from '@/types/zone';
import PropertiesOwnerCard from '@/components/ui/cards/PropertiesCard/PropertiesOwnerCard';

interface Props {
  zones: Zone[];
  onSelectProperty: (propertyId: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

export default function StepSelectPropertyGrouped({
  zones,
  onSelectProperty,
}: Props) {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-8">
      {zones.map((zone, index) => {
        const properties = zone.properties || [];
        if (properties.length === 0) return null;

        return (
          <motion.div
            key={zone.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-semibold text-dozeblue mb-4">
              {zone.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <PropertiesOwnerCard
                  key={property.id}
                  property={property}
                  onEdit={() => onSelectProperty(property.id)}
                />
              ))}
            </div>
          </motion.div>
        );
      })}

      {zones.every((z) => !z.properties || z.properties.length === 0) && (
        <p className="text-center text-dozegray mt-10">
          No hay propiedades disponibles en ninguna zona.
        </p>
      )}
    </div>
  );
}
