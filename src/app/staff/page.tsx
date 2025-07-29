'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { selectCustomerProfile } from '@/store/selectors/customerSelectors';
import AddPropertyWizard from '@/components/staff/AddPropertyWizard';

export default function StaffPage() {
  const router = useRouter();
  const profile = useSelector((state: RootState) =>
    selectCustomerProfile(state)
  );
  const [activeTab, setActiveTab] = useState<'home' | 'add'>('home');

  useEffect(() => {
    if (!profile) {
      router.push('/login?redirect=/staff');
    } else if (!profile.staff) {
      router.push('/');
    }
  }, [profile, router]);

  if (!profile || !profile.staff) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-dozeblue mb-6">Panel Staff</h1>

      {/* Submenú */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'home'
              ? 'border-dozeblue text-dozeblue'
              : 'border-transparent text-gray-500 hover:text-dozeblue'
          }`}
        >
          Inicio
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'add'
              ? 'border-dozeblue text-dozeblue'
              : 'border-transparent text-gray-500 hover:text-dozeblue'
          }`}
        >
          Añadir propiedad
        </button>
      </div>

      {/* Contenido de cada vista */}
      {activeTab === 'home' && (
        <div className="text-gray-700 dark:text-white/80">
          <p className="text-sm">
            Seleccioná una opción del menú para comenzar.
          </p>
        </div>
      )}

      {activeTab === 'add' && <AddPropertyWizard />}
    </div>
  );
}
