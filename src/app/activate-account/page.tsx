'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { activateCustomerAccount } from '@/store/customerSlice';

export default function ActivateAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.customer);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleActivate = async () => {
    if (!token) return;
    try {
      const res = await dispatch(activateCustomerAccount(token));
      if (activateCustomerAccount.fulfilled.match(res)) {
        setStatus('success');
        setTimeout(() => router.push('/login'), 2500);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-dozebg1 flex items-center justify-center px-4 py-12">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-dozebg2 shadow-2xl rounded-2xl w-full max-w-md px-10 py-12 border border-gray-200 dark:border-white/10 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-dozeblue mb-6"
        >
          Activá tu cuenta
        </motion.h1>

        {status === 'success' ? (
          <div className="flex flex-col items-center text-green-600 gap-2">
            <CheckCircle className="w-6 h-6" />
            <p className="text-sm font-medium">
              ¡Tu cuenta fue activada correctamente!
            </p>
            <p className="text-xs text-dozegray">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center text-red-600 gap-2">
            <AlertTriangle className="w-6 h-6" />
            <p className="text-sm font-medium">
              Hubo un problema al activar tu cuenta.
            </p>
            <p className="text-xs text-dozegray">
              Revisá el enlace o pedí uno nuevo.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-dozegray mb-6">
              Hacé clic en el botón para activar tu cuenta y comenzar a usar la
              plataforma.
            </p>
            <button
              onClick={handleActivate}
              disabled={loading || !token}
              className="w-full bg-dozeblue text-white font-semibold py-3 rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
            >
              {loading ? 'Activando...' : 'Activar cuenta'}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
