'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Property, PropertyFormData } from '@/types/property';
import StepBasicInfo from './StepBasicInfo';
import StepImages from './StepImages';
import StepSync from './StepSync';

interface Props {
  open: boolean;
  onClose: () => void;
  property: Property;
}

export default function PropertyEditModal({ open, onClose, property }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'sync'>(
    'info'
  );

  const propertyId = property.id;

  const [form, setForm] = useState<PropertyFormData>({
    name: property.name || '',
    address: property.address || '',
    description: property.description || '',
    zone_id: property.zone_id ?? null,
    zone: property.zone || '',
    pms_id: property.pms_id ?? null,
    coverImage: property.cover_image || '',
    images: property.images || [],
    latitude: property.latitude ?? null,
    longitude: property.longitude ?? null,
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-greenlight rounded-xl p-6 w-full max-w-2xl min-h-[600px] max-h-[90vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-dozeblue hover:text-dozeblue/80 transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-gray-200 dark:border-white/10">
          {[
            { key: 'info', label: 'Información' },
            { key: 'images', label: 'Imágenes' },
            { key: 'sync', label: 'Sincronizar PMS' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`relative px-5 py-2 font-medium transition-all 
                ${
                  activeTab === tab.key
                    ? 'text-dozeblue after:absolute after:-bottom-[1px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-[2px] after:bg-dozeblue after:rounded-full'
                    : 'text-gray-500 hover:text-dozeblue'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido con animación */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <StepBasicInfo
                  propertyId={propertyId}
                  form={form}
                  setForm={setForm}
                />
              </motion.div>
            )}
            {activeTab === 'images' && (
              <motion.div
                key="images"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <StepImages
                  form={form}
                  setForm={setForm}
                  propertyId={propertyId}
                />
              </motion.div>
            )}
            {activeTab === 'sync' && (
              <motion.div
                key="sync"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <StepSync
                  form={form}
                  setForm={setForm}
                  onClose={onClose}
                  propertyId={propertyId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
