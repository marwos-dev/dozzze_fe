'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, BedDouble, DoorOpen, Minus, Plus } from 'lucide-react';
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
  selectedPax: number | null;
  setSelectedZoneId: (id: number | null) => void;
  setSelectedHotelId: (id: number | null) => void;
  setSelectedRoomId: (id: number | null) => void;
  setSelectedServices: (services: string[]) => void;
  setSelectedType: (type: string[]) => void;
  setSelectedPax: (pax: number | null) => void;
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
  selectedPax,
  setSelectedZoneId,
  setSelectedHotelId,
  setSelectedServices,
  setSelectedType,
  setSelectedPax,
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

  return (
    <form className="flex flex-wrap items-center justify-center gap-4 pb-4">
      {/* Zona */}
      <div className="flex flex-col md:ml-10 min-w-[180px]">
        <label className="text-sm font-medium mb-1 flex items-center gap-1">
          <MapPin className="w-4 h-4" /> Zona
        </label>
        <select
          value={selectedZoneId ?? ''}
          onChange={(e) => setSelectedZoneId(Number(e.target.value) || null)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[var(--color-dozebg1)] text-[var(--foreground)]"
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
      <div className="flex flex-col min-w-[180px]">
        <label className="text-sm font-medium mb-1 flex items-center gap-1">
          <BedDouble className="w-4 h-4" /> Hotel
        </label>
        <select
          value={selectedHotelId ?? ''}
          onChange={(e) => setSelectedHotelId(Number(e.target.value) || null)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[var(--color-dozebg1)] text-[var(--foreground)]"
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
      <div className="flex flex-col min-w-[180px] relative" ref={dropdownRef}>
        <label className="text-sm font-medium mb-1 flex items-center gap-1">
          <DoorOpen className="w-4 h-4" /> Servicios
        </label>
        <button
          type="button"
          onClick={() => setIsServiceDropdownOpen((prev) => !prev)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-left bg-[var(--color-dozebg1)] text-[var(--foreground)]"
        >
          {selectedServices.length > 0
            ? `Seleccionados: ${selectedServices.length}`
            : 'Seleccioná servicios'}
        </button>

        {isServiceDropdownOpen && (
          <div className="absolute top-[100%] left-0 mt-2 w-full max-h-48 overflow-y-auto border border-gray-300 bg-[var(--color-dozebg1)] text-[var(--foreground)] rounded-lg shadow-lg p-2 z-50">
            {uniqueServices.map((service) => (
              <label
                key={service}
                className="flex items-center gap-2 py-1 cursor-pointer text-sm"
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
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tipo */}
      <div className="flex flex-col min-w-[180px]">
        <label className="text-sm font-medium mb-1 flex items-center gap-1">
          <DoorOpen className="w-4 h-4" /> Tipo
        </label>
        <select
          value={selectedType[0] ?? ''}
          onChange={(e) =>
            setSelectedType(e.target.value ? [e.target.value] : [])
          }
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[var(--color-dozebg1)] text-[var(--foreground)]"
        >
          <option value="">Todos los tipos</option>
          {uniqueType.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Personas */}
      <div className="flex flex-col min-w-[180px]">
        <label className="text-sm font-medium mb-1 flex items-center gap-1">
          <BedDouble className="w-4 h-4" /> Personas
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg px-2 py-2 gap-3 justify-between bg-[var(--color-dozebg1)] text-[var(--foreground)]">
          <button
            type="button"
            onClick={() =>
              setSelectedPax(
                selectedPax && selectedPax > 1 ? selectedPax - 1 : 1
              )
            }
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium whitespace-nowrap">
            {selectedPax ?? 1} persona{(selectedPax ?? 1) > 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() =>
              setSelectedPax(
                (selectedPax ?? 1) < 6 ? (selectedPax ?? 1) + 1 : 6
              )
            }
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
