'use client';

import { Room } from '@/types/room';
import PropertiesCard from '@/components/ui/cards/PropertiesCard/ProperitesCard';
import RoomCard from '@/components/ui/cards/RoomsCard/RoomCard';
import { Property } from '@/types/property';

interface Props {
  zones: any[];
  selectedZoneId: number | null;
  selectedHotelId: number | null;
  selectedRoomId: number | null;
  selectedServices: string[];
  selectedHotel: any;
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
    <>
      {(selectedZoneId ||
        selectedHotelId ||
        selectedRoomId ||
        selectedServices.length > 0) && (
        <div className="mt-8 bg-white p-4 rounded-xl shadow text-gray-700 text-sm sm:text-base">
          {/* Listado de propiedades */}
          {!selectedHotelId && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {zones.flatMap((zone) =>
                zone.properties
                  .filter((property: Property) => {
                    if (selectedZoneId && zone.id !== selectedZoneId)
                      return false;
                    if (
                      selectedRoomId &&
                      !property.rooms.some(
                        (room: Room) => room.id === selectedRoomId
                      )
                    )
                      return false;
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
                    <PropertiesCard
                      key={property.id}
                      {...property}
                      zone={zone.name}
                    />
                  ))
              )}
            </div>
          )}

          {/* Habitaciones del hotel */}
          {selectedHotel && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-dozeblue mb-4">
                Habitaciones disponibles en {selectedHotel.name}:
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {selectedHotel.rooms
                  .filter(
                    (room: Room) =>
                      selectedServices.length === 0 ||
                      selectedServices.every((srv) =>
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

          {/* Resumen */}
          <ul className="mt-6 space-y-1">
            <li>
              <strong>Servicios:</strong>{' '}
              {selectedServices.length > 0
                ? selectedServices.join(', ')
                : 'Todos los servicios'}
            </li>
            <li>
              <strong>Categoría:</strong>{' '}
              {selectedRoomId
                ? filteredRoomsByServices.find((r) => r.id === selectedRoomId)
                    ?.name
                : filteredRoomsByServices.map((r) => r.name).join(', ')}
            </li>
            <li>
              <strong>Huéspedes:</strong> {guests}
            </li>
            {promoCode && (
              <li>
                <strong>Código promocional:</strong> {promoCode}
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
