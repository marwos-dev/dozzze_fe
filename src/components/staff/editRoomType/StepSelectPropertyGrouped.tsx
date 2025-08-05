'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Zone } from '@/types/zone';
import PropertiesOwnerCard from '@/components/ui/cards/PropertiesCard/PropertiesOwnerCard';
import AddPropertyCard from '@/components/ui/cards/PropertiesCard/AddPropertyCard';

interface Props {
  zones: Zone[];
  onSelectProperty: (propertyId: number) => void;
  onEditProperty: (propertyId: number) => void;
  onAddProperty: () => void;
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

const propertyCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function StepSelectPropertyGrouped({
  zones,
  onSelectProperty,
  onEditProperty,
  onAddProperty,
}: Props) {
  const [expandedZones, setExpandedZones] = useState<Record<number, boolean>>(
    {}
  );

  const toggleExpand = (zoneId: number) => {
    setExpandedZones((prev) => ({
      ...prev,
      [zoneId]: !prev[zoneId],
    }));
  };

  return (
    <div className="px-4 sm:px-6 py-6 space-y-8">
      {zones.map((zone, index) => {
        const properties = zone.properties || [];
        if (properties.length === 0) return null;

        const isExpanded = expandedZones[zone.id] || false;
        const visibleProperties = isExpanded
          ? properties
          : properties.slice(0, 3);

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

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <motion.div
                layout
                variants={propertyCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AddPropertyCard onAdd={onAddProperty} />
              </motion.div>

              <AnimatePresence initial={false}>
                {visibleProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    layout
                    variants={propertyCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <PropertiesOwnerCard
                      property={property}
                      onSelect={() => onSelectProperty(property.id)}
                      onEdit={() => onEditProperty(property.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {properties.length > 3 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => toggleExpand(zone.id)}
                  className="inline-flex items-center gap-1 text-dozeblue hover:underline text-sm font-medium transition"
                >
                  {isExpanded
                    ? 'Ver menos propiedades'
                    : 'Ver todas las propiedades'}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  )}
                </button>
              </div>
            )}
          </motion.div>
        );
      })}

      {zones.every((z) => !z.properties || z.properties.length === 0) && (
        <div className="text-center mt-10">
          <p className="text-dozegray">
            No hay propiedades disponibles en ninguna zona.
          </p>
          <div className="mt-6 flex justify-center">
            <AddPropertyCard onAdd={onAddProperty} />
          </div>
        </div>
      )}
    </div>
  );
}
