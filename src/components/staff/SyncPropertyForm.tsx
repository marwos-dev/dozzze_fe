'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SyncData } from '@/types/property';
import { syncPropertyPMS, finalizePropertySync } from '@/store/propertiesSlice';

interface Props {
  propertyId?: number;
}

export default function SyncPropertyForm({ propertyId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector((state: RootState) => state.zones.data);
  const globalLoading = useSelector(
    (state: RootState) => state.properties.loading
  );

  const [selectedId, setSelectedId] = useState<number | null>(
    propertyId || null
  );
  const [syncData, setSyncData] = useState<SyncData>({
    base_url: '',
    email: '',
    phone_number: '',
    pms_token: '',
    pms_hotel_identifier: '',
    pms_username: '',
    pms_password: '',
  });
  const [syncReady, setSyncReady] = useState(false);
  const [syncingFinal, setSyncingFinal] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSyncData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    dispatch(syncPropertyPMS({ propertyId: selectedId, data: syncData })).then(
      (res) => {
        if (syncPropertyPMS.fulfilled.match(res)) {
          setSyncReady(true);
        }
      }
    );
  };

  const handleFinalize = async () => {
    if (!selectedId) return;
    setSyncingFinal(true);
    const result = await dispatch(finalizePropertySync(selectedId));
    setSyncingFinal(false);
    if (finalizePropertySync.fulfilled.match(result)) {
      setSyncSuccess(true);
    }
  };

  const handleBack = () => {
    setSelectedId(null);
    setSyncReady(false);
    setSyncSuccess(false);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedId && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-dozeblue mb-4">
              Seleccioná una propiedad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones.flatMap((zone) =>
                zone.properties?.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedId(prop.id)}
                    className={`rounded-xl overflow-hidden border-2 transition-all duration-200 shadow-sm hover:shadow-md text-left ${
                      selectedId === prop.id
                        ? 'border-dozeblue'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={prop.images?.[0] || '/logo.png'}
                        alt={prop.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-dozeblue mb-1 truncate">
                        {prop.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {prop.description}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}

        {selectedId && !syncReady && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6"
          >
            <h3 className="text-lg font-semibold text-dozeblue">
              Datos de sincronización
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(syncData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-dozegray dark:text-white/80 mb-1 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={key.replace(/_/g, ' ')}
                    className="w-full border border-gray-300 dark:border-white/20 px-4 py-2 rounded-md bg-white dark:bg-dozegray/10 text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handleBack}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white"
              >
                ← Atrás
              </button>

              <button
                onClick={handleSubmit}
                disabled={globalLoading}
                className="px-6 py-2 bg-dozeblue text-white rounded-lg hover:bg-dozeblue/90 disabled:opacity-50"
              >
                {globalLoading ? 'Enviando...' : 'Iniciar sincronización'}
              </button>
            </div>
          </motion.div>
        )}

        {syncReady && !syncSuccess && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-96 text-center space-y-6"
          >
            <h2 className="text-xl font-semibold text-dozeblue">
              Todo listo para sincronizar la propiedad
            </h2>
            <button
              onClick={handleFinalize}
              disabled={syncingFinal}
              className="px-6 py-3 bg-dozeblue text-white text-sm rounded-lg hover:bg-dozeblue/90 disabled:opacity-50"
            >
              {syncingFinal ? 'Sincronizando...' : 'Sincronizar ahora'}
            </button>
          </motion.div>
        )}

        {syncSuccess && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-96 text-center space-y-6"
          >
            <h2 className="text-xl font-semibold text-green-600">
              ¡Sincronización completa!
            </h2>
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white"
            >
              ← Volver a seleccionar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
