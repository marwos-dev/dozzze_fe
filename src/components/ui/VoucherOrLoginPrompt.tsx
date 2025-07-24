'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RootState } from '@/store';

export default function VoucherOrLoginPrompt() {
  const profile = useSelector((state: RootState) => state.customer.profile);
  const router = useRouter();
  const [voucher, setVoucher] = useState('');

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Código ingresado:', voucher);
  };

  if (!profile) {
    return (
      <div className="bg-white/40 border border-blue-100 p-4 rounded-md text-center">
        <p className="text-sm text-gray-700 mb-3">
          ¿Tenés una cuenta? Iniciá sesión para usar tus datos y aplicar códigos
          de descuento.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-dozeblue text-white rounded hover:bg-dozeblue/90 transition"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleVoucherSubmit}
      className="bg-white/40 border border-blue-100 p-4 rounded-md"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ingresá tu código de voucher:
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder="Ej: DESCUENTO10"
          className="flex-1 px-3 py-2 border rounded-md border-gray-300 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-dozeblue text-white rounded hover:bg-dozeblue/90 transition text-sm"
        >
          Aplicar
        </button>
      </div>
    </form>
  );
}
