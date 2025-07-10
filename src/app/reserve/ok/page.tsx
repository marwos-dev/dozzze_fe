'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PageOk() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-dozegray text-dozeblue dark:text-gray-100 px-4 py-10">

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        className="bg-green-100 dark:bg-green-700/40 rounded-full p-6 mb-6"
      >
        <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-300 animate-pulse" />
      </motion.div>

      <h1 className="text-3xl font-bold mb-2 text-dozeblue dark:text-white">¡Pago exitoso!</h1>
      <p className="text-base text-center mb-6 text-dozeblue dark:text-gray-300">
        Gracias por tu reserva. Te enviamos un email con los detalles.
      </p>

      <div className="rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-dozegray/20 shadow p-6 w-full max-w-md space-y-2">
        <p className="text-dozeblue dark:text-white">
          <span className="font-medium">Orden:</span> {order}
        </p>
        <p className="text-dozeblue dark:text-white">
          <span className="font-medium">Monto:</span> {amount} {currency}
        </p>
      </div>

      <button
        onClick={() => window.location.href = '/'}
        className="mt-8 bg-dozeblue text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-dozeblue/90 transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  );
}
