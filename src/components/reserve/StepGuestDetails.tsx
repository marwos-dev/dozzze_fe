'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setReservationData } from '@/store/reserveSlice';
import { selectReservationData } from '@/store/selectors/reserveSelectors';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function StepGuestDetails({ onNext, onBack }: Props) {
  const dispatch = useDispatch();
  const data = useSelector(selectReservationData);

  const [guestName, setGuestName] = useState(data?.guest_name || '');
  const [guestEmail, setGuestEmail] = useState(data?.guest_email || '');
  const [guestPhone, setGuestPhone] = useState(data?.guest_phone || '');
  const [guestAddress, setGuestAddress] = useState(data?.guest_address || '');
  const [guestCity, setGuestCity] = useState(data?.guest_city || '');
  const [guestCountry, setGuestCountry] = useState(data?.guest_country || '');
  const [guestCp, setGuestCp] = useState(data?.guest_cp || '');
  const [guestRemarks, setGuestRemarks] = useState(data?.guest_remarks || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validadores
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

  const handleContinue = () => {
    const newErrors = {
      guestName: validateField('guestName', guestName),
      guestEmail: validateField('guestEmail', guestEmail),
      guestPhone: validateField('guestPhone', guestPhone),
      guestCp: validateField('guestCp', guestCp),
      guestRemarks: validateField('guestRemarks', guestRemarks),
    };

    const hasErrors = Object.values(newErrors).some((e) => e !== '');

    if (hasErrors) return;

    dispatch(
      setReservationData({
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        guest_address: guestAddress,
        guest_city: guestCity,
        guest_country: guestCountry,
        guest_cp: guestCp,
        guest_remarks: guestRemarks,
      })
    );

    onNext();
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm rounded-md border ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-dozeblue focus:ring-dozeblue'
    } bg-white dark:bg-dozegray/10 dark:border-white/10 focus:outline-none focus:ring-2`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dozeblue">Datos del huésped</h2>

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

        {/* Código postal y Comentarios */}
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
      </div>

      {/* Botones */}
      <div className="flex justify-between">
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
          Continuar
        </button>
      </div>
    </div>
  );
}
