'use client';

import PropertiesCard from '@/components/ui/cards/PropertiesCard/ProperitesCard';
import RoomCard from '@/components/ui/cards/RoomsCard/RoomCard';
import { Property } from '@/types/property';
import { Room } from '@/types/room';

interface Props {
  zones: any[];
  selectedZoneId: number | null;
  selectedHotelId: number | null;
  selectedRoomId: number | null;
  selectedServices: string[];
  selectedHotel: any | undefined;
  filteredRooms: any[];
  filteredRoomsByServices: any[];
  promoCode: string;
  guests: number;
}

export default function SeekerResults({
  zones,
  selectedZoneId,
  selectedHotelId,
  selectedRoomId,
  selectedServices,
  selectedHotel,
  filteredRooms,
  filteredRoomsByServices,
  promoCode,
  guests,
}: Props) {
  return (
    <div className="mt-10">
      {/* Sin hotel seleccionado: mostrar propiedades */}
      {!selectedHotelId && (
        <div className="flex flex-col gap-6">
          {zones.flatMap((zone) =>
            zone.properties
              .filter((property: Property) => {
                if (selectedZoneId && zone.id !== selectedZoneId) return false;

                // Filtrar por habitación seleccionada (categoría)
                if (
                  selectedRoomId &&
                  !property.rooms.some(
                    (room: Room) => room.id === selectedRoomId
                  )
                )
                  return false;

                // Filtrar por servicios (al menos una habitación debe cumplir todos los servicios)
                if (
                  selectedServices.length > 0 &&
                  !property.rooms.some((room: Room) =>
                    selectedServices.every((srv) =>
                      room.services?.includes(srv)
                    )
                  )
                )
                  return false;

                return true;
              })
              .map((property: Property) => (
                <div key={property.id} className="w-full">
                  <PropertiesCard {...property} zone={zone.name} />
                </div>
              ))
          )}
        </div>
      )}

      {/* Hotel seleccionado: mostrar habitaciones filtradas */}
      {selectedHotel && (
        <div>
          <h3 className="text-lg font-semibold text-dozeblue mb-4">
            Habitaciones disponibles en {selectedHotel.name}:
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {selectedHotel.rooms
              .filter((room: Room) =>
                selectedServices.length === 0
                  ? true
                  : selectedServices.every((srv) =>
                      room.services?.includes(srv)
                    )
              )
              .map((room: Room) => (
                <RoomCard
                  key={room.id}
                  {...room}
                  services={room.services ?? []}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
