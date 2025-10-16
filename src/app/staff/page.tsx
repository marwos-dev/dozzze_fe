'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { AppDispatch, RootState } from '@/store';
import { getPropertyById, getMyProperties } from '@/store/propertiesSlice';
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
  const customerChecked = useSelector(
    (state: RootState) => state.customer.checked
  );

  const myProperties = useSelector(
    (state: RootState) => state.properties.myProperties
  );
  const myPropertiesLoading = useSelector(
    (state: RootState) => state.properties.myPropertiesLoading
  );
  const myPropertiesError = useSelector(
    (state: RootState) => state.properties.myPropertiesError
  );
  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'edit'>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [startInZoneId, setStartInZoneId] = useState<number | null>(null);

  useEffect(() => {
    if (!customerChecked) return;
    if (!profile) {
      router.push('/login?redirect=/staff');
    } else if (!profile.staff) {
      router.push('/');
    }
  }, [customerChecked, profile, router]);

  useEffect(() => {
    if (profile?.staff) {
      dispatch(getMyProperties());
    }
  }, [dispatch, profile?.staff]);

  type PropertyGroup = {
    zoneId: number;
    zoneName: string;
    properties: typeof myProperties;
  };

  const propertyGroups = useMemo(() => {
    const groups = new Map<number, PropertyGroup>();

    myProperties.forEach((property) => {
      const zoneId = property.zone_id;
      const zoneName = property.zone || 'Zona sin nombre';

      if (!groups.has(zoneId)) {
        groups.set(zoneId, { zoneId, zoneName, properties: [] });
      }

      groups.get(zoneId)!.properties.push(property);
    });

    return Array.from(groups.values()).sort((a, b) =>
      a.zoneName.localeCompare(b.zoneName)
    );
  }, [myProperties]);

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
        <>
          {myPropertiesLoading && (
            <div className="text-center text-dozegray">Cargando propiedades...</div>
          )}

          {myPropertiesError && !myPropertiesLoading && (
            <div className="text-center text-red-500 text-sm">
              {myPropertiesError}
            </div>
          )}

          {!myPropertiesLoading && !myPropertiesError && (
            <StepSelectPropertyGrouped
              groups={propertyGroups}
              onEditProperty={handleEditProperty}
              onAddProperty={handleAddProperty}
              onAddPropertyInZone={handleAddPropertyInZone}
            />
          )}
        </>
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
