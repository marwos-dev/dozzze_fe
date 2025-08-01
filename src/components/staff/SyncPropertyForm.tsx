'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { SyncData } from '@/types/property';
import { syncPropertyPMS, finalizePropertySync } from '@/store/propertiesSlice';
import { showToast } from '@/store/toastSlice';

interface Props {
  propertyId: number;
}

export default function SyncPropertyForm({ propertyId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const globalLoading = useSelector(
    (state: RootState) => state.properties.loading
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
    const fields = Object.entries(syncData);
    const emptyField = fields.find(([value]) => !value.trim());

    if (emptyField) {
      dispatch(
        showToast({
          message: `El campo "${emptyField[0].replace(/_/g, ' ')}" es obligatorio.`,
          color: 'red',
        })
      );
      return;
    }

    dispatch(syncPropertyPMS({ propertyId, data: syncData })).then((res) => {
      if (syncPropertyPMS.fulfilled.match(res)) {
        setSyncReady(true);
      }
    });
  };

  const handleFinalize = async () => {
    setSyncingFinal(true);
    const result = await dispatch(finalizePropertySync(propertyId));
    setSyncingFinal(false);
    if (finalizePropertySync.fulfilled.match(result)) {
      setSyncSuccess(true);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!syncReady && (
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

            <div className="flex justify-end pt-4">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
