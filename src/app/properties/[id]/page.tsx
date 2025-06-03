'use client';

import { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { loadFullPropertyById } from '@/store/propertiesSlice';
import RoomCard from '@/components/ui/cards/RoomsCard/RoomCard';
import PropertyBanner from '@/components/ui/banners/PropertyBanner';
import Spinner from '@/components/ui/spinners/Spinner';
import { selectRoomsForProperty } from '@/store/selectors/roomsSelectors';

interface PageProps {
  params: Promise<{ id: number }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const numericId = Number(id);
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProperty, loading, error } = useSelector(
    (state: RootState) => state.properties
  );

  const roomsFromStore = useSelector(selectRoomsForProperty(numericId));

  const rooms =
    roomsFromStore.length > 0
      ? roomsFromStore
      : selectedProperty?.id === numericId
        ? selectedProperty.rooms || []
        : [];

  useEffect(() => {
    dispatch(loadFullPropertyById(numericId));
  }, [numericId, dispatch]);

  if (loading || !selectedProperty || selectedProperty.id !== numericId)
    return <Spinner />;

  if (error) {
    return <p className="text-center text-red-500">Propiedad no encontrada.</p>;
  }

  return (
    <div className="overflow-x-hidden">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8">
        <PropertyBanner property={selectedProperty} />
      </div>
      <div className="max-w-6xl mx-auto px-4">
        {rooms.length === 0 ? (
          <p className="text-gray-500">
            No hay habitaciones disponibles para esta propiedad.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                {...room}
                services={room.services || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
