'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { selectCustomerProfile } from '@/store/selectors/customerSelectors';
import AddPropertyWizard from '@/components/staff/AddPropertyWizard';
import EditRoomTypeWizard from '@/components/staff/editRoomType/EditRoomTypeWizard';
import { Plus, Settings } from 'lucide-react';

export default function StaffPage() {
  const router = useRouter();
  const profile = useSelector((state: RootState) =>
    selectCustomerProfile(state)
  );

  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'edit'>('home');

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

        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'edit'
              ? 'border-dozeblue text-dozeblue'
              : 'border-transparent text-gray-500 hover:text-dozeblue'
          }`}
        >
          Editar habitaciones
        </button>
      </div>

      {/* Contenido dinámico por tab */}
      {activeTab === 'home' && (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
          <h2 className="text-2xl font-semibold text-dozeblue">
            ¿Qué deseas hacer?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setActiveTab('add')}
              className="flex items-center gap-2 px-6 py-3 text-lg"
            >
              <Plus className="w-5 h-5" />
              Añadir propiedad
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className="flex items-center gap-2 px-6 py-3 text-lg"
            >
              <Settings className="w-5 h-5" />
              Editar habitaciones
            </button>
          </div>
        </div>
      )}

      {activeTab === 'add' && <AddPropertyWizard />}
      {activeTab === 'edit' && <EditRoomTypeWizard />}
    </div>
  );
}
