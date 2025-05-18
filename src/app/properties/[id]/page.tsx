"use client";

import { use } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getPropertyById, setProperty } from "@/store/propertiesSlice";
import RoomCard from "@/components/ui/cards/RoomsCard/RoomCard";
import { Property } from "@/types/property";
import { Room } from "@/types/room";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();

  const { property, loading, error } = useSelector(
    (state: RootState) => state.properties
  );
  const zones = useSelector((state: RootState) => state.zones.data);

  useEffect(() => {
    const allProperties = zones.flatMap((zone) => zone.properties || []);
    const found: Property | undefined = allProperties.find(
      (p) => String(p.id) === id
    );

    if (found) {
      dispatch(setProperty(found));
    } else {
      dispatch(getPropertyById(id));
    }
  }, [id, zones, dispatch]);

  if (loading) {
    return <p className="text-center mt-20 text-lg">Cargando propiedad...</p>;
  }

  if (error || !property) {
    return (
      <p className="text-center mt-20 text-lg text-red-600">
        Propiedad no encontrada
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-dozeblue mb-6">{property.name}</h1>

      {property.rooms?.length === 0 ? (
        <p className="text-gray-500">
          No hay habitaciones disponibles para esta propiedad.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {property.rooms.map((room: Room) => (
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
  );
}
