"use client";

import { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getPropertyById } from "@/store/propertiesSlice";
import { setRoomsForProperty } from "@/store/roomsSlice";
import RoomCard from "@/components/ui/cards/RoomsCard/RoomCard";
import PropertyBanner from "@/components/ui/banners/PropertyBanner";
import { Room } from "@/types/room";
import Spinner from "@/components/ui/spinners/Spinner";

interface PageProps {
  params: Promise<{ id: number }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProperty, loading, error } = useSelector(
    (state: RootState) => state.properties
  );
  const zones = useSelector((state: RootState) => state.zones.data);

  useEffect(() => {
    if (!selectedProperty && id) {
      dispatch(getPropertyById(id));
    }
  }, [id, zones, dispatch, selectedProperty]);

  useEffect(() => {
    if (selectedProperty?.rooms && selectedProperty?.rooms.length > 0) {
      const rooms = selectedProperty.rooms || [];
      dispatch(setRoomsForProperty({ propertyId: id, rooms }));
    }
  }, [dispatch, selectedProperty, id]);

  if (loading || !selectedProperty) return <Spinner />;

  if (error) {
    return <p className="text-center text-red-500">Propiedad no encontrada.</p>;
  }
  return (
    // Aquí el wrapper que evita scroll lateral
    <div className="overflow-x-hidden">
      {/* Banner full width sin scroll lateral */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8">
        <PropertyBanner property={selectedProperty} />
      </div>
      {/* Contenido centrado */}
      <div className="max-w-6xl mx-auto px-4">
        {selectedProperty.rooms?.length === 0 ? (
          <p className="text-gray-500">
            No hay habitaciones disponibles para esta propiedad.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedProperty.rooms.map((room: Room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                description={room.description}
                pax={room.pax}
                services={room.services || []}
                images={room.images || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
