'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectReservationData } from '@/store/selectors/reserveSelectors';

interface Props {
  onBack: () => void;
}

export default function StepConfirmation({ onBack }: Props) {
  const data = useSelector(selectReservationData);

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError('Todos los campos de la tarjeta son obligatorios');
      return;
    }

    console.log('Reserva finalizada', { ...data, cardName, cardNumber });
    alert('Reserva confirmada!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dozeblue">Confirmar reserva</h2>
      <p className="text-sm text-[var(--foreground)]">
        Completá los datos de tu tarjeta para confirmar la reserva.
      </p>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dozegray/5 shadow-sm p-6 space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Nombre en la tarjeta
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Número de tarjeta
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Fecha de vencimiento
            </label>
            <input
              type="text"
              placeholder="MM/AA"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
            />
          </div>

          <div className="w-24">
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full px-4 py-3 taext-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-dozeblue border border-dozeblue px-6 py-3 rounded-lg text-sm font-medium hover:bg-dozeblue/10 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          Confirmar reserva
        </button>
      </div>
    </div>
  );
}
