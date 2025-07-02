'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginCustomer, signupCustomer } from '@/store/customerSlice';
import { AppDispatch, RootState } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.customer);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const payload = { email: email.toLowerCase().trim(), password };

    const res = isLogin
      ? await dispatch(loginCustomer(payload))
      : await dispatch(signupCustomer(payload));

    if (
      (isLogin && loginCustomer.fulfilled.match(res)) ||
      (!isLogin && signupCustomer.fulfilled.match(res))
    ) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-dozebg1 flex items-center justify-center px-4 py-12">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-dozebg2 shadow-2xl rounded-2xl w-full max-w-md px-12 py-14 border border-gray-200 dark:border-white/10"
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key={isLogin ? 'login-title' : 'signup-title'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-dozeblue text-center mb-8 flex items-center justify-center gap-2"
          >
            {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </motion.h1>
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'email-login' : 'email-signup'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <label className="block text-sm font-semibold text-dozegray mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-dozeblue focus:outline-none text-dozegray"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              key={isLogin ? 'pass-login' : 'pass-signup'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <label className="block text-sm font-semibold text-dozegray mb-1">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-dozeblue focus:outline-none text-dozegray"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>
          </AnimatePresence>

          <button
            type="submit"
            className="w-full bg-dozeblue text-white font-semibold py-3 rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarme'}
          </button>
        </form>

        <div className="text-center text-sm mt-6 text-dozegray">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés una cuenta?'}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-dozeblue font-medium hover:underline transition"
          >
            {isLogin ? 'Registrate' : 'Iniciar sesión'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
