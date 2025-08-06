'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '@/store';
import { postReservation } from '@/services/reservationApi';
import { showToast } from '@/store/toastSlice';
import { setRedsysData, updateReservations } from '@/store/reserveSlice';

interface Props {
  reservationIndex: number;
  onNext: () => void;
  onBack: () => void;
}

export default function StepGuestDetails({
  reservationIndex,
  onBack,
  onNext,
}: Props) {
  const dispatch = useDispatch();
  const data = useSelector(
    (state: RootState) => state.reserve.data[reservationIndex]
  );

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [guestCountry, setGuestCountry] = useState('');
  const [guestCp, setGuestCp] = useState('');
  const [guestRemarks, setGuestRemarks] = useState('');

  const [loading, setLoading] = useState(false);

  const [guestCorporate, setGuestCorporate] = useState('');
  const [guestRegion, setGuestRegion] = useState('');
  const [guestCountryIso, setGuestCountryIso] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setGuestName(data.guest_name || '');
      setGuestEmail(data.guest_email || '');
      setGuestPhone(data.guest_phone || '');
      setGuestAddress(data.guest_address || '');
      setGuestCity(data.guest_city || '');
      setGuestCountry(data.guest_country || '');
      setGuestCp(data.guest_cp || '');
      setGuestRemarks(data.guest_remarks || '');
      setGuestCorporate(data.guest_corporate || '');
      setGuestRegion(data.guest_region || '');
      setGuestCountryIso(data.guest_country_iso || '');
    }
  }, [data]);

  const validators = {
    name: (value: string) =>
      /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(value) ? '' : 'Debe tener al menos 3 letras',
    email: (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email inválido',
    phone: (value: string) =>
      /^[\d\s()+-]{8,}$/.test(value) ? '' : 'Teléfono inválido',
    cp: (value: string) =>
      value === '' || /^\d{1,10}$/.test(value)
        ? ''
        : 'Solo números, máx 10 dígitos',
    remarks: (value: string) =>
      value.length <= 200 ? '' : 'Máximo 200 caracteres',
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'guestName':
        error = validators.name(value);
        break;
      case 'guestEmail':
        error = validators.email(value);
        break;
      case 'guestPhone':
        error = validators.phone(value);
        break;
      case 'guestCp':
        error = validators.cp(value);
        break;
      case 'guestRemarks':
        error = validators.remarks(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const allReservations = useSelector((state: RootState) => state.reserve.data);
  const discountCode = useSelector(
    (state: RootState) => state.reserve.discount?.code
  );

  const handleContinue = async () => {
    const newErrors = {
      guestName: validateField('guestName', guestName),
      guestEmail: validateField('guestEmail', guestEmail),
      guestPhone: validateField('guestPhone', guestPhone),
      guestCp: validateField('guestCp', guestCp),
      guestRemarks: validateField('guestRemarks', guestRemarks),
    };

    if (Object.values(newErrors).some((e) => e !== '')) return;

    const fullReservations = allReservations.map((res) => ({
      ...res,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      guest_address: guestAddress,
      guest_city: guestCity,
      guest_country: guestCountry,
      guest_cp: guestCp,
      guest_remarks: guestRemarks,
      guest_corporate: guestCorporate,
      guest_region: guestRegion,
      guest_country_iso: guestCountryIso,
    }));

    setLoading(true);

    try {
      const res = await postReservation(fullReservations, discountCode);
      dispatch(updateReservations(fullReservations));
      dispatch(showToast({ message: 'Reserva Confirmada', color: 'green' }));
      if (res.redsys_args) {
        dispatch(setRedsysData(res.redsys_args));
      } else {
        dispatch(
          showToast({
            message: 'No se recibió información de pago',
            color: 'red',
          })
        );
      }
      onNext();
    } catch (err) {
      console.error('Error al confirmar reservas:', err);
      dispatch(
        showToast({ message: 'Error al confirmar reservas', color: 'red' })
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm rounded-md border ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-dozeblue focus:ring-dozeblue'
    } bg-white dark:bg-dozegray/10 dark:border-white/10 focus:outline-none focus:ring-2`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-dozeblue mb-4">
        Datos del huésped
      </h2>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dozegray/5 shadow-sm p-6 space-y-4">
        {/* Nombre */}
        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Nombre completo
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onBlur={(e) => validateField('guestName', e.target.value)}
            className={inputClass('guestName')}
          />
          {errors.guestName && (
            <p className="text-sm text-red-600 mt-1">{errors.guestName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Email
          </label>
          <input
            type="email"
            placeholder="Ej: juan@email.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            onBlur={(e) => validateField('guestEmail', e.target.value)}
            className={inputClass('guestEmail')}
          />
          {errors.guestEmail && (
            <p className="text-sm text-red-600 mt-1">{errors.guestEmail}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Teléfono
          </label>
          <input
            type="tel"
            placeholder="Ej: +54 9 11 1234-5678"
            value={guestPhone}
            onChange={(e) =>
              setGuestPhone(e.target.value.replace(/[^\d\s()+-]/g, ''))
            }
            onBlur={(e) => validateField('guestPhone', e.target.value)}
            className={inputClass('guestPhone')}
          />
          {errors.guestPhone && (
            <p className="text-sm text-red-600 mt-1">{errors.guestPhone}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Dirección
          </label>
          <input
            type="text"
            placeholder="Ej: Calle Falsa 123"
            value={guestAddress}
            onChange={(e) => setGuestAddress(e.target.value)}
            className={inputClass('guestAddress')}
          />
        </div>

        {/* Ciudad y País */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Ciudad
            </label>
            <input
              type="text"
              value={guestCity}
              onChange={(e) => setGuestCity(e.target.value)}
              className={inputClass('guestCity')}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              País
            </label>
            <input
              type="text"
              value={guestCountry}
              onChange={(e) => setGuestCountry(e.target.value)}
              className={inputClass('guestCountry')}
            />
          </div>
        </div>

        {/* Código postal y comentarios */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Código postal
            </label>
            <input
              type="text"
              value={guestCp}
              onChange={(e) =>
                setGuestCp(e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              onBlur={(e) => validateField('guestCp', e.target.value)}
              className={inputClass('guestCp')}
            />
            {errors.guestCp && (
              <p className="text-sm text-red-600 mt-1">{errors.guestCp}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Comentarios adicionales
            </label>
            <input
              type="text"
              placeholder="Ej: Llegaré después de las 20 hs"
              value={guestRemarks}
              maxLength={200}
              onChange={(e) => setGuestRemarks(e.target.value)}
              onBlur={(e) => validateField('guestRemarks', e.target.value)}
              className={inputClass('guestRemarks')}
            />
            {errors.guestRemarks && (
              <p className="text-sm text-red-600 mt-1">{errors.guestRemarks}</p>
            )}
          </div>
        </div>

        {/* Campos nuevos */}
        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Empresa / Cliente corporativo
          </label>
          <input
            type="text"
            value={guestCorporate}
            onChange={(e) => setGuestCorporate(e.target.value)}
            className={inputClass('guestCorporate')}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Región
            </label>
            <input
              type="text"
              value={guestRegion}
              onChange={(e) => setGuestRegion(e.target.value)}
              className={inputClass('guestRegion')}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Código país (ISO)
            </label>
            <input
              type="text"
              value={guestCountryIso}
              onChange={(e) => setGuestCountryIso(e.target.value)}
              className={inputClass('guestCountryIso')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="text-dozeblue border border-dozeblue px-6 py-3 rounded-lg text-sm font-medium hover:bg-dozeblue/10 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={handleContinue}
          className="bg-dozeblue text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-dozeblue/90 transition-colors"
        >
          {loading ? 'Procesando...' : 'Continuar'}
        </button>
      </div>
    </div>
  );
}
