'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { showToast } from '@/store/toastSlice';
import { getPms } from '@/services/pmsApi';
import { useEffect, useState } from 'react';
import type { PmsData } from '@/types/pms';
import type { PropertyFormData } from '@/types/property';

interface Props {
  form: PropertyFormData;
  setForm: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function StepBasicInfo({ form, setForm }: Props) {
  const dispatch = useDispatch();
  const zones = useSelector((state: RootState) => state.zones.data);

  const [pmsOptions, setPmsOptions] = useState<PmsData[]>([]);
  const [loadingPms, setLoadingPms] = useState(true);

  useEffect(() => {
    const fetchPms = async () => {
      try {
        const result = await getPms();
        setPmsOptions(result);
      } catch {
        dispatch(showToast({ message: 'Error al cargar PMS', color: 'red' }));
      } finally {
        setLoadingPms(false);
      }
    };
    fetchPms();
  }, [dispatch]);

  const handleChange = (field: keyof PropertyFormData, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    dispatch(
      showToast({
        message: 'Información actualizada (simulado)',
        color: 'green',
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Zona */}
      <div>
        <label className="block text-sm font-medium text-dozegray">Zona</label>
        <select
          value={form.zone_id ?? ''}
          onChange={(e) => {
            const selected = zones.find((z) => z.id === Number(e.target.value));
            setForm({
              ...form,
              zone_id: Number(e.target.value),
              zone: selected?.name || '',
            });
          }}
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

      {/* PMS */}
      <div>
        <label className="block text-sm font-medium text-dozegray">
          Sistema de PMS
        </label>
        <select
          value={form.pms_id ?? ''}
          onChange={(e) => handleChange('pms_id', Number(e.target.value))}
          disabled={loadingPms}
          className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 bg-white"
        >
          <option value="">Seleccionar PMS</option>
          {pmsOptions.map((pms) => (
            <option key={pms.id} value={pms.id}>
              {pms.name}
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
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition"
        >
          Actualizar información
        </button>
      </div>
    </div>
  );
}
