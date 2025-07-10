'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { selectCustomerProfile } from '@/store/selectors/customerSelectors';
import Link from 'next/link';

export default function ProfilePage() {
  const profile = useSelector((state: RootState) =>
    selectCustomerProfile(state)
  );

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-dozeblue mb-4">
          Sesión no iniciada
        </h2>
        <p className="text-gray-600 mb-6">
          Por favor iniciá sesión para ver tu perfil.
        </p>
        <Link
          href="/login?redirect=/profile"
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition"
        >
          Ir al login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-dozeblue mb-6">Mi perfil</h1>

      <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-dozegray dark:text-white/80">
            Email
          </label>
          <p className="text-lg font-semibold text-dozeblue mt-1">
            {profile.email}
          </p>
        </div>
      </div>
    </div>
  );
}
