'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { showToast } from '@/store/toastSlice';
import { getPms } from '@/services/pmsApi';
import {
  syncPropertyPMS,
  finalizePropertySync,
  getSyncData,
} from '@/store/propertiesSlice';
import { Loader2, CheckCircle } from 'lucide-react';
import type { SyncData, PropertyFormData } from '@/types/property';
import type { PmsData } from '@/types/pms';

interface Props {
  form: PropertyFormData;
  setForm: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  onClose: () => void;
  propertyId: number;
}

const SYNC_FIELDS: (keyof SyncData)[] = [
  'base_url',
  'email',
  'phone_number',
  'pms_token',
  'pms_hotel_identifier',
  'pms_username',
  'pms_password',
];

const FIELD_LABELS: Record<keyof SyncData, string> = {
  base_url: 'Base URL',
  email: 'Email',
  phone_number: 'Phone Number',
  pms_token: 'PMS Token',
  pms_hotel_identifier: 'PMS Hotel Identifier',
  pms_username: 'PMS Username',
  pms_password: 'PMS Password',
};

export default function StepSync({
  form,
  setForm,
  onClose,
  propertyId,
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

  const [status, setStatus] = useState<
    'idle' | 'saving' | 'saved' | 'syncing' | 'done'
  >('idle');
  const [pmsOptions, setPmsOptions] = useState<PmsData[]>([]);
  const [loadingPms, setLoadingPms] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const result = await getPms();
        setPmsOptions(result);
      } catch {
        dispatch(showToast({ message: 'Error al cargar PMS', color: 'red' }));
      } finally {
        setLoadingPms(false);
      }

      const res = await dispatch(getSyncData(propertyId));
      if (getSyncData.fulfilled.match(res)) {
        setSyncData(res.payload);
      }
    };

    fetchInitialData();
  }, [dispatch, propertyId]);

  const handleSyncField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSyncData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveData = async () => {
    if (!form.pms_id || !form.zone_id) {
      dispatch(
        showToast({ message: 'Seleccioná una zona y PMS.', color: 'red' })
      );
      return;
    }

    const missing = SYNC_FIELDS.find((key) => !syncData[key].trim());
    if (missing) {
      dispatch(
        showToast({
          message: `El campo "${FIELD_LABELS[missing]}" es obligatorio.`,
          color: 'red',
        })
      );
      return;
    }

    setStatus('saving');
    const res = await dispatch(syncPropertyPMS({ propertyId, data: syncData }));

    if (syncPropertyPMS.fulfilled.match(res)) {
      setStatus('saved');
      dispatch(
        showToast({ message: 'Datos guardados correctamente', color: 'green' })
      );
    } else {
      setStatus('idle');
      dispatch(showToast({ message: 'Error al guardar datos', color: 'red' }));
    }
  };

  const handleSyncNow = async () => {
    if (status !== 'saved') return;

    setStatus('syncing');
    const result = await dispatch(finalizePropertySync(propertyId));

    if (finalizePropertySync.fulfilled.match(result)) {
      setStatus('done');
      dispatch(
        showToast({ message: 'Sincronización completa', color: 'green' })
      );
      onClose();
    } else {
      setStatus('saved');
      dispatch(showToast({ message: 'Error al sincronizar', color: 'red' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Selección de PMS */}
      <div>
        <label className="block text-sm font-medium text-dozegray">
          Sistema de PMS
        </label>
        <select
          value={form.pms_id ?? ''}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, pms_id: Number(e.target.value) }))
          }
          disabled={loadingPms || status === 'saving' || status === 'syncing'}
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

      {/* Campos de sincronización */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SYNC_FIELDS.map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-dozegray mb-1">
              {FIELD_LABELS[key]}
            </label>
            <input
              name={key}
              value={syncData[key]}
              onChange={handleSyncField}
              disabled={status === 'saving' || status === 'syncing'}
              className="w-full px-4 py-2 border rounded-md border-gray-300 text-sm bg-white"
              placeholder={FIELD_LABELS[key]}
            />
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between pt-4">
        {status === 'done' ? (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="w-5 h-5" />
            Sincronización completa
          </div>
        ) : (
          <>
            <button
              onClick={handleSaveData}
              disabled={status !== 'idle'}
              className="px-6 py-2 rounded-lg bg-dozeblue text-white hover:bg-dozeblue/90 transition disabled:opacity-50"
            >
              {status === 'saving' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </span>
              ) : (
                'Guardar datos'
              )}
            </button>

            <button
              onClick={handleSyncNow}
              disabled={status !== 'saved'}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {status === 'syncing' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sincronizando...
                </span>
              ) : (
                'Sincronizar ahora'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
