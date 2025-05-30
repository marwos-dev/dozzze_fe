'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, BedDouble, DoorOpen } from 'lucide-react';
import { Zone } from '@/types/zone';
import { Property } from '@/types/property';
import { Room } from '@/types/room';

interface Props {
  zones: Zone[];
  hotels: Property[];
  filteredRooms: Room[];
  uniqueServices: string[];
  uniqueType: string[];
  selectedZoneId: number | null;
  selectedHotelId: number | null;
  selectedRoomId: number | null;
  selectedServices: string[];
  selectedType: string[];
  setSelectedZoneId: (id: number | null) => void;
  setSelectedHotelId: (id: number | null) => void;
  setSelectedRoomId: (id: number | null) => void;
  setSelectedServices: (services: string[]) => void;
  setSelectedType: (type: string[]) => void;

  loading: boolean;
}

export default function SeekerFilters({
  zones,
  hotels,
  uniqueServices,
  uniqueType,
  selectedZoneId,
  selectedHotelId,
  selectedServices,
  selectedType,
  setSelectedZoneId,
  setSelectedHotelId,
  setSelectedServices,
  setSelectedType,
  loading,
}: Props) {
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsServiceDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    // Skeletons
  }

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
      <div className="relative" ref={dropdownRef}>
        <label className="text-sm font-medium mb-1 block">
          <DoorOpen className="inline w-4 h-4 mr-1" />
          Servicios
        </label>
        <button
          type="button"
          onClick={() => setIsServiceDropdownOpen((prev) => !prev)}
          className="w-full border border-gray-300 rounded-lg p-2 text-left"
        >
          {selectedServices.length > 0
            ? `Seleccionados: ${selectedServices.length}`
            : 'Seleccioná servicios'}
        </button>

        {isServiceDropdownOpen && (
          <div className="absolute z-20 mt-2 w-full max-h-48 overflow-y-auto border border-gray-300 bg-white rounded-lg shadow-md p-2">
            {uniqueServices.map((service) => (
              <label
                key={service}
                className="flex items-center space-x-2 cursor-pointer py-1"
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
                  className="w-4 h-4 text-dozeblue rounded border-gray-300"
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tipo */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          <DoorOpen className="inline w-4 h-4 mr-1" />
          Tipo
        </label>
        <select
          value={selectedType[0] ?? ''}
          onChange={(e) =>
            setSelectedType(e.target.value ? [e.target.value] : [])
          }
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">Todos los tipos</option>
          {uniqueType.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
