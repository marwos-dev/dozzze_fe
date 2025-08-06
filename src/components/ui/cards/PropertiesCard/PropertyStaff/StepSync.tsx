'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { showToast } from '@/store/toastSlice';
import { getPms } from '@/services/pmsApi';
import { syncPropertyPMS, finalizePropertySync } from '@/store/propertiesSlice';
import { Loader2, CheckCircle } from 'lucide-react';
import type { SyncData, PropertyFormData } from '@/types/property';
import type { PmsData } from '@/types/pms';

interface Props {
  form: PropertyFormData;
  setForm: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  onClose: () => void;
  propertyId: number;
}

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

  const [status, setStatus] = useState<'idle' | 'saving' | 'syncing' | 'done'>(
    'idle'
  );
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

  const handleSyncField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSyncData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.pms_id || !form.zone_id) {
      dispatch(
        showToast({ message: 'Seleccioná una zona y PMS.', color: 'red' })
      );
      return;
    }

    const missing = Object.entries(syncData).find(([, val]) => !val.trim());
    if (missing) {
      dispatch(
        showToast({
          message: `El campo "${missing[0].replace(/_/g, ' ')}" es obligatorio.`,
          color: 'red',
        })
      );
      return;
    }

    if (status !== 'idle') return;

    setStatus('saving');
    const res = await dispatch(
      syncPropertyPMS({ propertyId, data: syncData }) // ✅ cambio
    );

    if (syncPropertyPMS.fulfilled.match(res)) {
      setStatus('syncing');
      const result = await dispatch(finalizePropertySync(propertyId)); // ✅ cambio

      if (finalizePropertySync.fulfilled.match(result)) {
        setStatus('done');
        dispatch(
          showToast({ message: 'Sincronización completa', color: 'green' })
        );
        onClose();
      } else {
        setStatus('done');
        dispatch(
          showToast({
            message: 'Error al sincronizar (Continuando)',
            color: 'yellow',
          })
        );
        onClose();
      }
    } else {
      setStatus('done');
      dispatch(
        showToast({
          message: 'Error al guardar datos (Continuando)',
          color: 'yellow',
        })
      );
      onClose();
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
          disabled={loadingPms || status !== 'idle'}
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
        {Object.entries(syncData).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-dozegray capitalize mb-1">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              name={key}
              value={value}
              onChange={handleSyncField}
              disabled={status !== 'idle'}
              className="w-full px-4 py-2 border rounded-md border-gray-300 text-sm bg-white"
              placeholder={key.replace(/_/g, ' ')}
            />
          </div>
        ))}
      </div>

      {/* Botón de acción */}
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
            {status === 'idle' && 'Guardar y sincronizar'}
          </button>
        )}
      </div>
    </div>
  );
}
