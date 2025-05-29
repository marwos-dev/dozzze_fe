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
  const filteredZones = selectedZoneId
    ? zones.filter((zone) => zone.id === selectedZoneId)
    : zones;

  // Mostrar solo habitaciones filtradas por servicios, sin hotel seleccionado
  const showRoomsOnly =
    !selectedHotelId && selectedServices.length > 0 && !selectedHotel;

  return (
    <div className="mt-10">
      {/* Mostrar RoomCards si hay servicios seleccionados pero ningún hotel */}
      {showRoomsOnly && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredZones.flatMap((zone) =>
            zone.properties.flatMap((property: Property) =>
              property.rooms
                .filter((room: Room) =>
                  selectedServices.every((srv) => room.services?.includes(srv))
                )
                .map((room: Room) => (
                  <RoomCard
                    key={room.id}
                    {...room}
                    services={room.services ?? []}
                  />
                ))
            )
          )}
        </div>
      )}

      {/* Sin hotel seleccionado y sin filtros de servicio: mostrar propiedades */}
      {!selectedHotelId && !showRoomsOnly && (
        <div className="flex flex-col gap-6">
          {filteredZones.flatMap((zone) =>
            zone.properties
              .filter((property: Property) => {
                // Filtrar por categoría de habitación
                if (
                  selectedRoomId &&
                  !property.rooms.some(
                    (room: Room) => room.id === selectedRoomId
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

      {/* Hotel seleccionado: mostrar habitaciones de ese hotel */}
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

          {/* Si no hay habitaciones que coincidan */}
          {selectedHotel.rooms.filter((room: Room) =>
            selectedServices.every((srv) => room.services?.includes(srv))
          ).length === 0 && (
            <p className="text-muted-foreground mt-4">
              No hay habitaciones que coincidan con los servicios seleccionados.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
