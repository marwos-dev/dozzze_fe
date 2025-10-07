'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { showToast } from '@/store/toastSlice';
import type { PropertyService } from '@/types/property';
import { getServiceIcon, SERVICE_ICON_MAP } from '@/icons';
import type { ServiceCode } from '@/icons';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');
  const [lockedIds, setLockedIds] = useState<Set<number>>(new Set());

  const normalize = (str: string) => str.trim().toLowerCase();
  const formatCodeForBackend = (str: string) =>
    str.trim().toUpperCase().replace(/[\s/-]+/g, '_');

  useEffect(() => {
    const load = async () => {
      try {
        const [propertySvcs, allSvcs] = await Promise.all([
          getPropertyServices(propertyId),
          fetchAllServices(),
        ]);
        setServices(propertySvcs);
        setAvailableServices(allSvcs);
        const locked = propertySvcs
          .filter((svc) =>
            allSvcs.some((s) => normalize(s.code) === normalize(svc.code))
          )
          .map((s) => s.id);
        setLockedIds(new Set(locked));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [propertyId]);

  const handleAdd = async () => {
    const formattedCode = formatCodeForBackend(form.code);
    if (!formattedCode || !form.name.trim()) return;
    if (services.some((s) => normalize(s.code) === normalize(formattedCode))) {
      dispatch(
        showToast({ message: 'El servicio ya fue agregado', color: 'red' })
      );
      return;
    }
    try {
      const payload = {
        code: formattedCode,
        name: form.name.trim(),
        description: form.description.trim(),
      };
      const created = await createPropertyService(propertyId, payload);
      setServices((prev) => [...prev, created]);
      setForm({ code: '', name: '', description: '' });
      setShowCodePicker(false);
    } catch (e) {
      console.error(e);
      dispatch(
        showToast({ message: 'Error al crear servicio', color: 'red' })
      );
    }
  };

  const handleAddExisting = async (svc: PropertyService) => {
    const formattedCode = formatCodeForBackend(svc.code);
    if (services.some((s) => normalize(s.code) === normalize(formattedCode))) {
      dispatch(
        showToast({ message: 'El servicio ya fue agregado', color: 'red' })
      );
      return;
    }
    try {
      const created = await createPropertyService(propertyId, {
        code: formattedCode,
        name: svc.name,
        description: svc.description,
      });
      setServices((prev) => [...prev, created]);
      setLockedIds((prev) => new Set(prev).add(created.id));
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
      setLockedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (e) {
      console.error(e);
      dispatch(
        showToast({ message: 'Error al eliminar servicio', color: 'red' })
      );
    }
  };

  const handleDeleteByCode = async (code: string) => {
    const normalized = normalize(code);
    const svcToDelete = usedServicesByCode.get(normalized)?.[0];
    if (!svcToDelete) return;
    await handleDelete(svcToDelete.id);
  };

  const filteredAvailable = useMemo(() => {
    const term = normalize(searchTerm);
    return availableServices
      .filter((svc) => {
        if (!term) return true;
        return (
          normalize(svc.name).includes(term) ||
          normalize(svc.code).includes(term) ||
          normalize(svc.description || '').includes(term)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [availableServices, searchTerm]);

  const getIconForService = (svc: PropertyService) => {
    const normalizedCode = svc.code || svc.name;
    const key = normalizedCode
      ? normalizedCode.trim().toUpperCase().replace(/[\s/-]+/g, '_')
      : '';
    return getServiceIcon(key);
  };

  const usedServicesByCode = useMemo(() => {
    const map = new Map<string, PropertyService[]>();
    services.forEach((svc) => {
      const key = normalize(svc.code);
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(svc);
    });
    return map;
  }, [services]);

  const usedCodes = useMemo(() => new Set(usedServicesByCode.keys()), [usedServicesByCode]);

  const iconCodes = useMemo(
    () => Object.keys(SERVICE_ICON_MAP) as ServiceCode[],
    []
  );

  const filteredIconCodes = useMemo(() => {
    const term = normalize(codeSearch);
    return iconCodes.filter((code) => {
      if (usedCodes.has(normalize(code))) return false;
      if (!term) return true;
      return code.toLowerCase().includes(term);
    });
  }, [iconCodes, codeSearch, usedCodes]);

  const cardTransition = {
    type: 'spring' as const,
    stiffness: 320,
    damping: 26,
    mass: 0.6,
  };

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-dozeblue">Servicios de la propiedad</h3>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-dozegray/10 space-y-3 min-h-[24rem] max-h-[32rem] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-[var(--foreground)]">Servicios asignados</h4>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {services.length}
            </span>
          </div>
          <div className="flex-1 overflow-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-dozeblue/40 scrollbar-track-transparent">
            {services.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="w-full rounded-xl border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500 dark:border-white/10 dark:text-gray-300">
                  Todavía no agregaste servicios a la propiedad.
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {services.map((svc) => {
                  const locked = lockedIds.has(svc.id);
                  const Icon = getIconForService(svc);
                  return (
                    <motion.div
                      key={svc.id}
                      layout
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.96 }}
                      transition={cardTransition}
                      className={`rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dozegray/10 p-4 shadow-sm transition hover:shadow-md ${
                        locked ? 'opacity-90' : ''
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-1 gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-dozeblue/10 text-dozeblue">
                            <Icon size={26} aria-hidden />
                          </span>

                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-[var(--foreground)]">
                                {svc.name || 'Servicio sin nombre'}
                              </span>
                              <span className="rounded-full bg-dozeblue/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-dozeblue">
                                {svc.code || 'SIN CÓDIGO'}
                              </span>
                              {locked && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                                  Catálogo
                                </span>
                              )}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                                Código
                                <input
                                  value={svc.code}
                                  onChange={(e) => {
                                    if (locked) return;
                                    const updated = { ...svc, code: e.target.value };
                                    setServices((prev) =>
                                      prev.map((s) => (s.id === svc.id ? updated : s))
                                    );
                                    handleUpdate(updated);
                                  }}
                                  disabled={locked}
                                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[var(--foreground)] transition focus:border-dozeblue focus:bg-white focus:outline-none dark:border-white/10 dark:bg-dozegray/20 dark:focus:border-dozeblue disabled:cursor-not-allowed disabled:border-transparent disabled:bg-dozeblue/10 disabled:text-gray-500"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                                Nombre
                                <input
                                  value={svc.name}
                                  onChange={(e) => {
                                    if (locked) return;
                                    const updated = { ...svc, name: e.target.value };
                                    setServices((prev) =>
                                      prev.map((s) => (s.id === svc.id ? updated : s))
                                    );
                                    handleUpdate(updated);
                                  }}
                                  disabled={locked}
                                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[var(--foreground)] transition focus:border-dozeblue focus:bg-white focus:outline-none dark:border-white/10 dark:bg-dozegray/20 dark:focus:border-dozeblue disabled:cursor-not-allowed disabled:border-transparent disabled:bg-dozeblue/10 disabled:text-gray-500"
                                />
                              </label>

                              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                                Descripción
                                <input
                                  value={svc.description || ''}
                                  onChange={(e) => {
                                    if (locked) return;
                                    const updated = { ...svc, description: e.target.value };
                                    setServices((prev) =>
                                      prev.map((s) => (s.id === svc.id ? updated : s))
                                    );
                                    handleUpdate(updated);
                                  }}
                                  disabled={locked}
                                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[var(--foreground)] transition focus:border-dozeblue focus:bg-white focus:outline-none dark:border-white/10 dark:bg-dozegray/20 dark:focus:border-dozeblue disabled:cursor-not-allowed disabled:border-transparent disabled:bg-dozeblue/10 disabled:text-gray-500"
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row items-start justify-end gap-2 sm:flex-col">
                          <button
                            type="button"
                            onClick={() => handleDelete(svc.id)}
                            className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:border-red-300 hover:bg-red-100"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="space-y-4 w-full lg:max-w-sm lg:justify-self-start">
          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-4 space-y-4 shadow-sm bg-white dark:bg-dozegray/10 min-h-[24rem]">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-dozeblue/80">Agregar servicio existente</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                Busca en la biblioteca y agrega servicios predefinidos con un click.
              </p>
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, código o descripción"
                  className="w-full border border-gray-300 dark:border-white/20 rounded-md px-3 py-2 bg-white dark:bg-dozegray/10 text-sm pr-9"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                  {filteredAvailable.length}
                </span>
              </div>
            </div>

            <div className="relative">
              <motion.div
                layout
                className="min-h-[18rem] max-h-[18rem] overflow-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-dozeblue/40 scrollbar-track-transparent"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {filteredAvailable.map((svc) => {
                    const Icon = getIconForService(svc);
                    const codeKey = normalize(svc.code);
                    const usedInstances = usedServicesByCode.get(codeKey) ?? [];
                    const isUsed = usedInstances.length > 0;
                    const usedCountLabel = usedInstances.length > 1 ? `x${usedInstances.length}` : '';
                    return (
                      <motion.div
                        key={svc.id}
                        layout
                        initial={{ opacity: 0, y: 18, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.96 }}
                        transition={cardTransition}
                        className={`w-full rounded-lg border p-3 shadow-sm transition bg-white dark:bg-dozegray/10 ${
                          isUsed
                            ? 'border-emerald-200/70 hover:border-emerald-300'
                            : 'border-gray-200 dark:border-white/10 hover:border-dozeblue/60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              isUsed ? 'bg-emerald-100 text-emerald-700' : 'bg-dozeblue/10 text-dozeblue'
                            }`}
                          >
                            <Icon size={20} aria-hidden />
                          </span>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-[var(--foreground)] truncate">
                                {svc.name}
                              </p>
                              {isUsed && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                                  En uso {usedCountLabel}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate uppercase tracking-wider">
                              {svc.code}
                            </p>
                            {svc.description && (
                              <p className="text-xs text-gray-500 truncate">
                                {svc.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {isUsed ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteByCode(svc.code)}
                                className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-600 transition hover:border-red-300 hover:bg-red-100"
                              >
                                Quitar
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddExisting(svc)}
                                className="rounded-md border border-dozeblue/20 bg-dozeblue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-dozeblue transition hover:border-dozeblue/40 hover:bg-dozeblue/20"
                              >
                                Agregar
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
              {filteredAvailable.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-md border border-dashed border-gray-300 bg-white/70 text-center text-sm text-gray-500 dark:bg-dozegray/40 dark:text-gray-300">
                  Sin resultados para tu búsqueda
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-4 space-y-4 shadow-sm bg-white dark:bg-dozegray/10">
            <h4 className="font-medium text-dozeblue/80">Crear servicio nuevo</h4>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                Ícono / código
              </label>
              <button
                type="button"
                onClick={() => setShowCodePicker((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-dozeblue focus:border-dozeblue focus:outline-none dark:border-white/20 dark:bg-dozegray/15"
              >
                <span className="flex items-center gap-2 truncate">
                  {form.code ? (
                    <>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-dozeblue/10 text-dozeblue">
                        {(() => {
                          const Icon = SERVICE_ICON_MAP[form.code as ServiceCode] ?? getServiceIcon(form.code);
                          return <Icon size={18} aria-hidden />;
                        })()}
                      </span>
                      <span className="font-medium uppercase tracking-wide">{form.code}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Seleccionar icono disponible</span>
                  )}
                </span>
                <span className="text-xs font-semibold text-dozeblue">
                  {showCodePicker ? 'Cerrar' : 'Ver todos'}
                </span>
              </button>

              {showCodePicker && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-dozegray/20">
                  <div className="relative mb-3">
                    <input
                      value={codeSearch}
                      onChange={(e) => setCodeSearch(e.target.value)}
                      placeholder="Buscar por código"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:border-dozeblue focus:outline-none dark:border-white/20 dark:bg-dozegray/10"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                      {filteredIconCodes.length}
                    </span>
                  </div>
                  <div className="max-h-48 overflow-auto grid grid-cols-2 gap-2 sm:grid-cols-3 scrollbar-thin scrollbar-thumb-dozeblue/40 scrollbar-track-transparent">
                    {filteredIconCodes.length === 0 && (
                      <div className="col-span-full rounded-md border border-dashed border-gray-300 py-6 text-center text-xs text-gray-500">
                        Sin coincidencias
                      </div>
                    )}
                    {filteredIconCodes.map((code) => {
                      const Icon = SERVICE_ICON_MAP[code];
                      const selected = form.code === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, code }));
                            setShowCodePicker(false);
                            setCodeSearch('');
                          }}
                          className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                            selected
                              ? 'border-dozeblue bg-dozeblue/10 text-dozeblue'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-dozeblue/60 hover:text-dozeblue'
                          }`}
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-dozeblue/10">
                            <Icon size={20} aria-hidden />
                          </span>
                          {code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
              className="w-full bg-dozeblue text-white px-4 py-2 rounded-md hover:bg-dozeblue/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!form.code || !form.name}
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
