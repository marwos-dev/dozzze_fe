'use client';

import { MapPin, BedDouble, DoorOpen } from 'lucide-react';

interface Props {
  zones: any[];
  hotels: any[];
  filteredRooms: any[];
  uniqueServices: string[];
  selectedZoneId: number | null;
  selectedHotelId: number | null;
  selectedRoomId: number | null;
  selectedServices: string[];
  promoCode: string;
  rooms: number;
  guests: number;
  setSelectedZoneId: (id: number | null) => void;
  setSelectedHotelId: (id: number | null) => void;
  setSelectedRoomId: (id: number | null) => void;
  setSelectedServices: (services: string[]) => void;
  setPromoCode: (code: string) => void;
  setRooms: (n: number) => void;
  setGuests: (n: number) => void;
}

export default function SeekerFilters({
  zones,
  hotels,
  filteredRooms,
  uniqueServices,
  selectedZoneId,
  selectedHotelId,
  selectedRoomId,
  selectedServices,
  promoCode,
  rooms,
  guests,
  setSelectedZoneId,
  setSelectedHotelId,
  setSelectedRoomId,
  setSelectedServices,
  setPromoCode,
  setRooms,
  setGuests,
}: Props) {
  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      {/* Zona */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          <MapPin className="inline w-4 h-4 mr-1" />
          Zona
        </label>
        <select
          value={selectedZoneId ?? ''}
          onChange={(e) => setSelectedZoneId(Number(e.target.value) || null)}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">Todas las zonas</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hotel */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          <BedDouble className="inline w-4 h-4 mr-1" />
          Hotel
        </label>
        <select
          value={selectedHotelId ?? ''}
          onChange={(e) => setSelectedHotelId(Number(e.target.value) || null)}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">Todos los hoteles</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </select>
      </div>

      {/* Servicios */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          <DoorOpen className="inline w-4 h-4 mr-1" />
          Servicios
        </label>
        <div className="flex flex-col max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
          {uniqueServices.map((service) => (
            <label
              key={service}
              className="inline-flex items-center space-x-2 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => {
                  if (selectedServices.includes(service)) {
                    setSelectedServices(
                      selectedServices.filter((s) => s !== service)
                    );
                  } else {
                    setSelectedServices([...selectedServices, service]);
                  }
                }}
                className="w-5 h-5 text-dozeblue rounded border-gray-300"
              />
              <span>{service}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          <DoorOpen className="inline w-4 h-4 mr-1" />
          Categoría
        </label>
        <select
          value={selectedRoomId ?? ''}
          onChange={(e) => setSelectedRoomId(Number(e.target.value) || null)}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">Todas las categorías</option>
          {filteredRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
