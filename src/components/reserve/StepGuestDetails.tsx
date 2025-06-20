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
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!guestName || !guestEmail || !guestPhone) {
      setError('Nombre, email y teléfono son obligatorios');
      return;
    }

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dozeblue">Datos del huésped</h2>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dozegray/5 shadow-sm p-6 space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Nombre completo
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Email
          </label>
          <input
            type="email"
            placeholder="Ej: juan@email.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Teléfono
          </label>
          <input
            type="tel"
            placeholder="Ej: +54 9 11 1234-5678"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Dirección
          </label>
          <input
            type="text"
            placeholder="Ej: Calle Falsa 123"
            value={guestAddress}
            onChange={(e) => setGuestAddress(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Ciudad
            </label>
            <input
              type="text"
              value={guestCity}
              onChange={(e) => setGuestCity(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
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
              className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Código postal
            </label>
            <input
              type="text"
              value={guestCp}
              onChange={(e) => setGuestCp(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Comentarios adicionales
            </label>
            <input
              type="text"
              placeholder="Ej: Llegaré después de las 20 hs"
              value={guestRemarks}
              onChange={(e) => setGuestRemarks(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

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
