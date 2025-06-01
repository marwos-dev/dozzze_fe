// SeekerResults.tsx
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
  selectedPax: number | null;
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
  selectedPax,
  selectedHotel,
  filteredRooms,
  filteredRoomsByServices,
  filteredRoomsByType,
  loading,
}: Props) {
  const filteredZones = selectedZoneId
    ? zones.filter((zone) => zone.id === selectedZoneId)
    : zones;

  const showRoomsOnly =
    !selectedHotelId &&
    (selectedServices.length > 0 ||
      selectedType.length > 0 ||
      selectedPax !== null) &&
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
      {/* Mostrar RoomCards si hay filtros sin hotel seleccionado */}
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

                  const paxMatch =
                    selectedPax === null || room.pax === selectedPax;

                  return servicesMatch && typeMatch && paxMatch;
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

      {/* Mostrar propiedades si no hay filtros activos */}
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

      {/* Hotel seleccionado: mostrar habitaciones */}
      {selectedHotel && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-dozeblue mb-4">
            Habitaciones disponibles en {selectedHotel.name}:
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {selectedHotel.rooms
              .filter((room: Room) => {
                const serviceOk =
                  selectedServices.length === 0 ||
                  selectedServices.every((srv) => room.services?.includes(srv));

                const typeOk =
                  selectedType.length === 0 ||
                  selectedType.includes(room.type ?? '');

                const paxOk = selectedPax === null || room.pax === selectedPax;

                return serviceOk && typeOk && paxOk;
              })
              .map((room: Room) => (
                <RoomCard
                  key={room.id}
                  {...room}
                  services={room.services ?? []}
                />
              ))}
          </div>

          {selectedHotel.rooms.filter((room: Room) => {
            const serviceOk =
              selectedServices.length === 0 ||
              selectedServices.every((srv) => room.services?.includes(srv));
            const typeOk =
              selectedType.length === 0 ||
              selectedType.includes(room.type ?? '');
            const paxOk = selectedPax === null || room.pax === selectedPax;
            return serviceOk && typeOk && paxOk;
          }).length === 0 && (
            <p className="text-muted-foreground mt-4">
              No hay habitaciones que coincidan con los filtros seleccionados.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
