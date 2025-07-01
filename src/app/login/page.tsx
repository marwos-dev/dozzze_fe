'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { signupCustomer } from '@/store/customerSlice';
import { AppDispatch, RootState } from '@/store';

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

    if (isLogin) {
      console.log('Login aún no implementado');
    } else {
      const res = await dispatch(signupCustomer({ email, password }));
      if (signupCustomer.fulfilled.match(res)) {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#edeaff] flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 transition-all duration-300">
        <h1 className="text-2xl font-bold text-dozeblue text-center mb-4 flex items-center justify-center gap-2">
          {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dozegray">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-dozeblue focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dozegray">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-dozeblue focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-dozeblue text-white font-semibold py-2 rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
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
      </div>
    </div>
  );
}
