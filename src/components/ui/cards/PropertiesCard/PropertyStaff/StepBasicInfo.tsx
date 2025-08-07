'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { showToast } from '@/store/toastSlice';
import { useState } from 'react';
import { updateProperty } from '@/services/propertiesApi';
import type { PropertyFormData } from '@/types/property';

interface Props {
  form: PropertyFormData;
  setForm: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  propertyId: number;
}

export default function StepBasicInfo({ form, setForm, propertyId }: Props) {
  const dispatch = useDispatch();
  const zones = useSelector((state: RootState) => state.zones.data);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    field: keyof PropertyFormData,
    value: string | number | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const { name, address, description, latitude, longitude, zone_id } = form;

    if (!name || !address || !description || !zone_id) {
      dispatch(
        showToast({
          message: 'Completá todos los campos obligatorios.',
          color: 'red',
        })
      );
      return;
    }

    setLoading(true);
    try {
      await updateProperty(propertyId, {
        name,
        address,
        description,
        latitude,
        longitude,
        zone_id,
      });
      dispatch(
        showToast({
          message: 'Información actualizada correctamente.',
          color: 'green',
        })
      );
    } catch (_) {
      console.error(_);
      dispatch(
        showToast({
          message: 'Error al actualizar la propiedad.',
          color: 'red',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Zona */}
      <div>
        <label className="block text-sm font-medium text-dozegray">Zona</label>
        <select
          value={form.zone_id ?? ''}
          onChange={(e) =>
            handleChange('zone_id', Number(e.target.value) || null)
          }
          className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 bg-white"
        >
          <option value="">Seleccionar zona</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
      </div>

      {/* name, address, description */}
      {(['name', 'address', 'description'] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-dozegray capitalize">
            {field}
          </label>
          {field === 'description' ? (
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 bg-white"
            />
          ) : (
            <input
              type="text"
              value={form[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 bg-white"
            />
          )}
        </div>
      ))}

      {/* Botón guardar */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Actualizar información'}
        </button>
      </div>
    </div>
  );
}
