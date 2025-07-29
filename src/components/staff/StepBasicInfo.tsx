'use client';

import { showToast } from '@/store/toastSlice';
import { useDispatch } from 'react-redux';
import type { Zone } from '@/types/zone';
import type { PropertyFormData } from '@/types/property';

interface Props {
  data: PropertyFormData;
  onChange: (data: PropertyFormData) => void;
  onNext: () => void;
  zones: Zone[];
}

export default function StepBasicInfo({
  data,
  onChange,
  onNext,
  zones,
}: Props) {
  const dispatch = useDispatch();

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

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-dozeblue">
        Paso 1: Información básica
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

      {/* Campos: name, address, coverImage, description */}
      {(['name', 'address', 'coverImage', 'description'] as const).map(
        (field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-dozegray dark:text-white/80 capitalize">
              {field === 'coverImage' ? 'Imagen (URL)' : field}
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
                onChange={(e) => onChange({ ...data, [field]: e.target.value })}
                className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10"
                placeholder={
                  field === 'coverImage' ? 'https://...' : `Ingrese ${field}`
                }
              />
            )}
          </div>
        )
      )}

      <div className="flex justify-end pt-2">
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
