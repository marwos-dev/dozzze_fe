'use client';

import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PageFailed() {
  const searchParams = useSearchParams();
  const order = searchParams.get('order');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-dozegray text-dozeblue px-4 py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        className="bg-red-100 dark:bg-red-600/20 rounded-full p-6 mb-6"
      >
        <XCircle className="w-16 h-16 text-red-600 dark:text-red-400 animate-pulse" />
      </motion.div>

      <h1 className="text-3xl font-bold mb-2">¡Pago rechazado!</h1>
      <p className="text-base text-center mb-6">
        No pudimos procesar tu pago. Verificá los datos o intentá nuevamente.
      </p>

      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dozegray/10 shadow p-6 w-full max-w-md space-y-2">
        <p><span className="font-medium">Orden:</span> {order}</p>
        <p><span className="font-medium">Monto:</span> {amount} {currency}</p>
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
