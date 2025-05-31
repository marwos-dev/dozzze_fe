'use client';

import PropertiesCard from '@/components/ui/cards/PropertiesCard/ProperitesCard';
import RoomCard from '@/components/ui/cards/RoomsCard/RoomCard';
import { Property } from '@/types/property';
import { Room } from '@/types/room';
import { Zone } from '@/types/zone';
import PropertiesCardSkeleton from '../skeletons/PropertyCardSkeleton';

interface Props {
  zones: Zone[];
  selectedZoneId: number | null;
  selectedHotelId: number | null;
  selectedRoomId: number | null;
  selectedServices: string[];
  selectedType: string[];
  selectedHotel: Property | undefined;
  filteredRooms: Room[];
  filteredRoomsByServices: Room[];
  filteredRoomsByType: Room[];

  loading: boolean;
}

export default function SeekerResults({
  zones,
  selectedZoneId,
  selectedHotelId,
  selectedRoomId,
  selectedServices,
  selectedType,
  selectedHotel,
  loading,
}: Props) {
  const filteredZones = selectedZoneId
    ? zones.filter((zone) => zone.id === selectedZoneId)
    : zones;

  const showRoomsOnly =
    !selectedHotelId &&
    (selectedServices.length > 0 || selectedType.length > 0) &&
    !selectedHotel;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PropertiesCardSkeleton />
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Mostrar RoomCards si hay servicios o tipos seleccionados pero ningún hotel */}
      {showRoomsOnly && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredZones.flatMap((zone) =>
            zone.properties.flatMap((property: Property) =>
              property.rooms
                .filter((room: Room) => {
                  const servicesMatch =
                    selectedServices.length === 0 ||
                    selectedServices.every((srv) =>
                      room.services?.includes(srv)
                    );

                  const typeMatch =
                    selectedType.length === 0 ||
                    selectedType.every((typ) => room.type?.includes(typ));

                  return servicesMatch && typeMatch;
                })
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

      {/* Mostrar propiedades si no hay filtros de servicios ni tipos ni hotel seleccionado */}
      {!selectedHotelId && !showRoomsOnly && (
        <div className="flex flex-col gap-6">
          {filteredZones.flatMap((zone) =>
            zone.properties
              .filter((property: Property) => {
                if (
                  selectedRoomId &&
                  !property.rooms.some(
                    (room: Room) => room.id === selectedRoomId
                  )
                ) {
                  return false;
                }
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

      {/* Hotel seleccionado: mostrar habitaciones filtradas por servicios */}
      {selectedHotel && selectedServices.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-dozeblue mb-4">
            Habitaciones disponibles en {selectedHotel.name} (Servicios):
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {selectedHotel.rooms
              .filter((room: Room) =>
                selectedServices.every((srv) => room.services?.includes(srv))
              )
              .map((room: Room) => (
                <RoomCard
                  key={room.id}
                  {...room}
                  services={room.services ?? []}
                />
              ))}
          </div>
          {selectedHotel.rooms.filter((room: Room) =>
            selectedServices.every((srv) => room.services?.includes(srv))
          ).length === 0 && (
            <p className="text-muted-foreground mt-4">
              No hay habitaciones que coincidan con los servicios seleccionados.
            </p>
          )}
        </div>
      )}

      {/* Hotel seleccionado: mostrar habitaciones filtradas por tipo */}
      {selectedHotel && selectedType.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-dozeblue mb-4">
            Habitaciones disponibles en {selectedHotel.name} (Tipos):
          </h3>
          {selectedType.map((type) => {
            const filteredRooms = selectedHotel.rooms.filter((room: Room) =>
              room.type?.includes(type)
            );
            if (filteredRooms.length === 0) {
              return (
                <div key={type} className="mb-6">
                  <h4 className="text-md font-semibold text-dozeblue">
                    Tipo: {type}
                  </h4>
                  <p className="text-muted-foreground">
                    No hay habitaciones de este tipo disponibles.
                  </p>
                </div>
              );
            }

            return (
              <div key={type} className="mb-8">
                <h4 className="text-md font-semibold text-dozeblue mb-2">
                  Tipo: {type}
                </h4>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRooms.map((room: Room) => (
                    <RoomCard
                      key={room.id}
                      {...room}
                      services={room.services ?? []}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
