'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
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
    pms_id: (property as any).pms_id ?? null, // ⚠️ cast si aún no está en el tipo
    coverImage: property.cover_image || '',
    images: property.images || [],
    latitude: (property as any).latitude ?? null,
    longitude: (property as any).longitude ?? null,
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-greenlight rounded-xl p-6 w-full max-w-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          className="absolute top-4 right-4 text-dozeblue hover:text-dozeblue/80 transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'info'
                ? 'bg-dozeblue text-white'
                : 'bg-white text-dozeblue'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'images'
                ? 'bg-dozeblue text-white'
                : 'bg-white text-dozeblue'
            }`}
            onClick={() => setActiveTab('images')}
          >
            Imágenes
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'sync'
                ? 'bg-dozeblue text-white'
                : 'bg-white text-dozeblue'
            }`}
            onClick={() => setActiveTab('sync')}
          >
            Sincronizar PMS
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          {activeTab === 'info' && (
            <StepBasicInfo form={form} setForm={setForm} />
          )}
          {activeTab === 'images' && (
            <StepImages form={form} setForm={setForm} />
          )}
          {activeTab === 'sync' && (
            <StepSync
              form={form}
              setForm={setForm}
              onClose={onClose}
              propertyId={propertyId} // ✅ para sincronizar
            />
          )}
        </div>
      </div>
    </div>
  );
}
