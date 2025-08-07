'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { showToast } from '@/store/toastSlice';
import type { PropertyService } from '@/types/property';
import {
  getPropertyServices,
  createPropertyService,
  updatePropertyService,
  deletePropertyService,
  fetchAllServices,
} from '@/services/propertiesApi';

interface Props {
  propertyId: number;
  /**
   * Optional callback used when this component is rendered as a step within the
   * property creation wizard. When omitted (e.g. inside the edit modal) the
   * "Continuar" button is hidden and actions happen immediately.
   */
  onNext?: () => void;
}

export default function StepPropertyServices({ propertyId, onNext }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [services, setServices] = useState<PropertyService[]>([]);
  const [availableServices, setAvailableServices] = useState<PropertyService[]>([]);
  const [form, setForm] = useState({ code: '', name: '', description: '' });
  const [selectedExisting, setSelectedExisting] = useState<number | ''>('');

  const normalize = (str: string) => str.trim().toLowerCase();

  useEffect(() => {
    const load = async () => {
      try {
        const [propertySvcs, allSvcs] = await Promise.all([
          getPropertyServices(propertyId),
          fetchAllServices(),
        ]);
        setServices(propertySvcs);
        setAvailableServices(allSvcs);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [propertyId]);

  const handleAdd = async () => {
    if (!form.code.trim() || !form.name.trim()) return;
    if (services.some((s) => normalize(s.code) === normalize(form.code))) {
      dispatch(
        showToast({ message: 'El servicio ya fue agregado', color: 'red' })
      );
      return;
    }
    try {
      const created = await createPropertyService(propertyId, form);
      setServices((prev) => [...prev, created]);
      setForm({ code: '', name: '', description: '' });
    } catch (e) {
      console.error(e);
      dispatch(
        showToast({ message: 'Error al crear servicio', color: 'red' })
      );
    }
  };

  const handleAddExisting = async () => {
    const svc = availableServices.find((s) => s.id === selectedExisting);
    if (!svc) return;
    if (services.some((s) => normalize(s.code) === normalize(svc.code))) {
      dispatch(
        showToast({ message: 'El servicio ya fue agregado', color: 'red' })
      );
      return;
    }
    try {
      const created = await createPropertyService(propertyId, {
        code: svc.code,
        name: svc.name,
        description: svc.description,
      });
      if (
        services.some(
          (s) => s.id === created.id || normalize(s.code) === normalize(created.code)
        )
      ) {
        dispatch(
          showToast({ message: 'El servicio ya fue agregado', color: 'red' })
        );
        return;
      }
      setServices((prev) => [...prev, created]);
      setSelectedExisting('');
    } catch (e) {
      console.error(e);
      dispatch(
        showToast({ message: 'Error al agregar servicio', color: 'red' })
      );
    }
  };

  const handleUpdate = async (svc: PropertyService) => {
    try {
      const updated = await updatePropertyService(propertyId, svc.id, svc);
      setServices((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (e) {
      console.error(e);
      dispatch(
        showToast({ message: 'Error al actualizar servicio', color: 'red' })
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePropertyService(propertyId, id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
      dispatch(
        showToast({ message: 'Error al eliminar servicio', color: 'red' })
      );
    }
  };

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-dozeblue">Servicios de la propiedad</h3>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <div className="space-y-3 w-full">
          {services.length === 0 && (
            <p className="text-sm text-gray-500">No hay servicios registrados.</p>
          )}
          {services.map((svc) => (
            <div
              key={svc.id}
              className={
                'grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-gray-50 dark:bg-dozegray/20 ' +
                'border border-gray-200 dark:border-white/10 rounded-md p-3'
              }
            >
              <input
                value={svc.code}
                onChange={(e) => {
                  const updated = { ...svc, code: e.target.value };
                  setServices((prev) =>
                    prev.map((s) => (s.id === svc.id ? updated : s))
                  );
                  handleUpdate(updated);
                }}
                className="w-full border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-dozegray/10 text-sm"
              />
              <input
                value={svc.name}
                onChange={(e) => {
                  const updated = { ...svc, name: e.target.value };
                  setServices((prev) =>
                    prev.map((s) => (s.id === svc.id ? updated : s))
                  );
                  handleUpdate(updated);
                }}
                className="w-full border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-dozegray/10 text-sm"
              />
              <input
                value={svc.description || ''}
                onChange={(e) => {
                  const updated = { ...svc, description: e.target.value };
                  setServices((prev) =>
                    prev.map((s) => (s.id === svc.id ? updated : s))
                  );
                  handleUpdate(updated);
                }}
                className="w-full border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-dozegray/10 text-sm"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(svc.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 w-full lg:max-w-sm lg:justify-self-start">
          <div className="border border-gray-200 dark:border-white/10 rounded-md p-4 space-y-3">
            <h4 className="font-medium text-dozeblue/80">Agregar servicio existente</h4>
            <div className="space-y-2">
              <select
                value={selectedExisting}
                onChange={(e) =>
                  setSelectedExisting(
                    e.target.value ? Number(e.target.value) : ''
                  )
                }
                className="w-full border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-dozegray/10 text-sm"
              >
                <option value="">Seleccionar servicio</option>
                {availableServices
                  .filter(
                    (svc) =>
                      !services.some(
                        (s) => normalize(s.code) === normalize(svc.code)
                      )
                  )
                  .map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleAddExisting}
                disabled={!selectedExisting}
                className="w-full bg-dozeblue text-white px-4 py-2 rounded-md hover:bg-dozeblue/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-white/10 rounded-md p-4 space-y-3">
            <h4 className="font-medium text-dozeblue/80">Crear servicio nuevo</h4>
            <input
              placeholder="Código"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-dozegray/10 text-sm"
            />
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-dozegray/10 text-sm"
            />
            <input
              placeholder="Descripción"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-dozegray/10 text-sm"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-dozeblue text-white px-4 py-2 rounded-md hover:bg-dozeblue/90"
            >
              Agregar nuevo
            </button>
          </div>
        </div>
      </div>

      {onNext && (
        <div className="flex justify-end pt-4">
          <button
            onClick={onNext}
            className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}

