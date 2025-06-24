'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectReservationData } from '@/store/selectors/reserveSelectors';
import { CreditCard, BadgeDollarSign, Landmark } from 'lucide-react';

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

  const getCardType = (number: string) => {
    const clean = number.replace(/\s/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^5[1-5]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'default';
  };

  const isFutureExpiry = (mmYY: string) => {
    const [mm, yy] = mmYY.split('/');
    if (!mm || !yy || isNaN(Number(mm)) || isNaN(Number(yy))) return false;
    const now = new Date();
    const exp = new Date(Number('20' + yy), Number(mm) - 1, 1);
    return exp > new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const handleSubmit = () => {
    const sanitizedCardNumber = cardNumber.replace(/\s/g, '');

    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError('Todos los campos de la tarjeta son obligatorios');
      return;
    }

    if (sanitizedCardNumber.length !== 16) {
      setError('El número de tarjeta debe tener 16 dígitos');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError('La fecha debe tener el formato MM/AA');
      return;
    }

    if (!isFutureExpiry(expiryDate)) {
      setError('La fecha de vencimiento debe ser futura');
      return;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      setError('El CVV debe tener 3 o 4 dígitos');
      return;
    }

    setError('');
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
        {/* Nombre */}
        <div>
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Nombre en la tarjeta
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={cardName}
            maxLength={26}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
          />
        </div>

        {/* Número de tarjeta */}
        <div className="relative">
          <label className="text-sm font-medium block mb-1 text-dozeblue">
            Número de tarjeta
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            maxLength={19} // 16 dígitos + 3 espacios
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
              const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
              setCardNumber(formatted);
            }}
            className="w-full px-4 py-3 pr-12 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
          />
          <div className="absolute right-3 top-[42px] text-dozeblue">
            {getCardType(cardNumber) === 'visa' && (
              <CreditCard className="w-5 h-5" />
            )}
            {getCardType(cardNumber) === 'mastercard' && (
              <BadgeDollarSign className="w-5 h-5" />
            )}
            {getCardType(cardNumber) === 'amex' && (
              <Landmark className="w-5 h-5" />
            )}
            {getCardType(cardNumber) === 'default' && (
              <CreditCard className="w-5 h-5 opacity-40" />
            )}
          </div>
        </div>

        {/* Fecha y CVV */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1 text-dozeblue">
              Fecha de vencimiento
            </label>
            <input
              type="text"
              placeholder="MM/AA"
              maxLength={5}
              value={expiryDate}
              onChange={(e) => {
                let value = e.target.value.replace(/[^\d/]/g, '');

                if (expiryDate.length > value.length) {
                  setExpiryDate(value);
                  return;
                }

                if (value.length === 2 && !value.includes('/')) {
                  value = value + '/';
                }

                setExpiryDate(value.slice(0, 5));
              }}
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
              maxLength={4}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setCvv(value);
              }}
              className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue dark:border-white/10 bg-white dark:bg-dozegray/10 focus:outline-none focus:ring-2 focus:ring-dozeblue"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
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
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          Confirmar reserva
        </button>
      </div>
    </div>
  );
}
