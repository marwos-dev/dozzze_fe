'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { SyncData } from '@/types/property';
import { syncPropertyPMS, finalizePropertySync } from '@/store/propertiesSlice';
import { showToast } from '@/store/toastSlice';
import { CheckCircle, Loader2 } from 'lucide-react';

interface Props {
  propertyId: number;
  onSyncComplete?: () => void;
}

export default function SyncPropertyForm({
  propertyId,
  onSyncComplete,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [syncData, setSyncData] = useState<SyncData>({
    base_url: '',
    email: '',
    phone_number: '',
    pms_token: '',
    pms_hotel_identifier: '',
    pms_username: '',
    pms_password: '',
  });

  const [status, setStatus] = useState<'idle' | 'saving' | 'syncing' | 'done'>(
    'idle'
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSyncData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (status !== 'idle') return;

    const emptyField = Object.entries(syncData).find(
      ([value]) => !value.trim()
    );

    if (emptyField) {
      dispatch(
        showToast({
          message: `El campo "${emptyField[0].replace(/_/g, ' ')}" es obligatorio.`,
          color: 'red',
        })
      );
      return;
    }

    setStatus('saving');
    const res = await dispatch(syncPropertyPMS({ propertyId, data: syncData }));
    if (syncPropertyPMS.fulfilled.match(res)) {
      setStatus('syncing');
      const result = await dispatch(finalizePropertySync(propertyId));
      if (finalizePropertySync.fulfilled.match(result)) {
        setStatus('done');
        if (onSyncComplete) onSyncComplete();
      } else {
        setStatus('done');
        dispatch(
          showToast({
            message: 'Error al sincronizar Continuando...',
            color: 'yellow',
          })
        );
        if (onSyncComplete) onSyncComplete();
      }
    } else {
      setStatus('done');
      dispatch(
        showToast({
          message: 'Error al guardar datos Continuando...',
          color: 'yellow',
        })
      );
      if (onSyncComplete) onSyncComplete();
    }
  };

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
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
              disabled={status !== 'idle'}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        {status === 'done' ? (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="w-5 h-5" />
            Sincronización completa
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={status !== 'idle'}
            className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 transition ${
              status === 'saving'
                ? 'bg-dozeblue/70'
                : status === 'syncing'
                  ? 'bg-green-600'
                  : 'bg-dozeblue hover:bg-dozeblue/90'
            } disabled:opacity-50`}
          >
            {status === 'saving' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando PMS...
              </>
            )}
            {status === 'syncing' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sincronizando...
              </>
            )}
            {status === 'idle' && 'Guardar PMS'}
          </button>
        )}
      </div>
    </div>
  );
}
