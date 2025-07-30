'use client';

import { useRef } from 'react';
import { showToast } from '@/store/toastSlice';
import { useDispatch } from 'react-redux';
import type { Zone } from '@/types/zone';
import type { PropertyFormData } from '@/types/property';
import Image from 'next/image';

interface Props {
  data: PropertyFormData;
  onChange: (data: PropertyFormData) => void;
  onNext: () => void;
  onBack: () => void;
  zones: Zone[];
}

export default function StepBasicInfo({
  data,
  onChange,
  onNext,
  onBack,
  zones,
}: Props) {
  const dispatch = useDispatch();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    const { name, address, description, zone_id } = data;
    if (!name || !address || !description || !zone_id) {
      dispatch(
        showToast({ message: 'Completá todos los campos.', color: 'red' })
      );
      return;
    }
    onNext();
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    if (urls.length > 0) {
      onChange({
        ...data,
        coverImage: urls[0],
        images: urls,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-dozeblue">
        Paso 2: Información básica
      </h2>

      {/* Zona */}
      <div>
        <label className="block text-sm font-medium text-dozegray dark:text-white/80">
          Zona
        </label>
        <select
          value={data.zone_id || ''}
          onChange={(e) => {
            const selectedZone = zones.find(
              (z) => z.id === Number(e.target.value)
            );
            onChange({
              ...data,
              zone_id: Number(e.target.value) || null,
              zone: selectedZone?.name || '',
            });
          }}
          className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10"
        >
          <option value="">Seleccionar zona</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campos de texto */}
      {(['name', 'address', 'description'] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-dozegray dark:text-white/80 capitalize">
            {field}
          </label>
          {field === 'description' ? (
            <textarea
              value={data.description}
              onChange={(e) =>
                onChange({ ...data, description: e.target.value })
              }
              rows={4}
              className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10"
              placeholder="Descripción detallada..."
            />
          ) : (
            <input
              type="text"
              value={data[field]}
              onChange={(e) => onChange({ ...data, [field]: e.target.value })}
              className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10"
              placeholder={`Ingrese ${field}`}
            />
          )}
        </div>
      ))}

      {/* Galería de imágenes */}
      <div>
        <label className="block text-sm font-medium text-dozegray dark:text-white/80 mb-1">
          Galería de imágenes
        </label>
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="w-full px-4 py-3 text-center border border-dashed border-gray-400 dark:border-white/20 rounded-lg bg-gray-50 dark:bg-dozegray/20 text-dozegray dark:text-white/80 hover:bg-gray-100 transition"
        >
          Elegir imágenes desde tu dispositivo
        </button>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelection}
          ref={imageInputRef}
          hidden
        />

        {data.images?.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-3 min-w-full max-w-full">
              {data.images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative h-28 w-36 rounded-lg overflow-hidden border border-gray-300 dark:border-white/20 shrink-0"
                >
                  <Image
                    src={url}
                    alt={`Imagen ${idx}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navegación */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white"
        >
          ← Atrás
        </button>
        <button
          onClick={handleNext}
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
