'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { AppDispatch, RootState } from '@/store';
import { getZones } from '@/store/zoneSlice';
import { getPropertyById } from '@/store/propertiesSlice';
import { selectCustomerProfile } from '@/store/selectors/customerSelectors';

import AddPropertyWizard from '@/components/staff/AddPropertyWizard';
import EditRoomTypeWizard from '@/components/staff/editRoomType/EditRoomTypeWizard';
import StepSelectPropertyGrouped from '@/components/staff/editRoomType/StepSelectPropertyGrouped';

export default function StaffPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector((state: RootState) =>
    selectCustomerProfile(state)
  );

  const zones = useSelector((state: RootState) => state.zones.data);
  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'edit'>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [startInZoneId, setStartInZoneId] = useState<number | null>(null);

  useEffect(() => {
    if (!profile) {
      router.push('/login?redirect=/staff');
    } else if (!profile.staff) {
      router.push('/');
    }
  }, [profile, router]);

  useEffect(() => {
    if (!zones || zones.length === 0) {
      dispatch(getZones());
    }
  }, [dispatch, zones]);

  const handleEditProperty = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    dispatch(getPropertyById(propertyId));
    setActiveTab('edit');
  };

  const handleAddProperty = () => {
    setStartInZoneId(null);
    setActiveTab('add');
  };

  const handleAddPropertyInZone = (zoneId: number) => {
    setStartInZoneId(zoneId);
    setActiveTab('add');
  };

  if (!profile || !profile.staff) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-dozeblue mb-6">Panel Staff</h1>

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
          onClick={() => handleAddProperty()}
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

      {activeTab === 'home' && (
        <StepSelectPropertyGrouped
          zones={zones}
          onEditProperty={handleEditProperty}
          onAddProperty={handleAddProperty}
          onAddPropertyInZone={handleAddPropertyInZone}
        />
      )}

      {activeTab === 'add' && (
        <AddPropertyWizard startInZoneId={startInZoneId || undefined} />
      )}

      {activeTab === 'edit' && selectedPropertyId && (
        <EditRoomTypeWizard initialPropertyId={selectedPropertyId} />
      )}
    </div>
  );
}
