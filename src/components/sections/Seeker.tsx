'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { motion } from 'framer-motion';
import SeekerFilters from '@/components/ui/seeker/SeekerFilter';
import SeekerResults from '@/components/ui/seeker/SeekerResult';
import AnimatedButton from '../ui/buttons/AnimatedButton';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

type SeekerProps = {
  initialFilterOpen?: boolean;
  loading: boolean;
};

export default function Seeker({
  initialFilterOpen = false,
  loading,
}: SeekerProps) {
  const { data: zones } = useSelector((state: RootState) => state.zones);

  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedPax, setSelectedPax] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(initialFilterOpen);

  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  const hotels = useMemo(() => {
    return selectedZoneId
      ? selectedZone?.properties || []
      : zones.flatMap((z) => z.properties);
  }, [selectedZoneId, selectedZone, zones]);

  const selectedHotel = hotels.find((h) => h.id === selectedHotelId);

  const allRooms = useMemo(() => {
    return zones.flatMap((z) =>
      z.properties.flatMap((p) =>
        p.rooms.map((r) => ({ ...r, propertyId: p.id }))
      )
    );
  }, [zones]);

  // 🚫 Sin filtro de pax (para servicios y tipos)
  const filterableRooms = useMemo(() => {
    let rooms = allRooms;

    if (selectedHotelId) {
      rooms = rooms.filter((room) => room.propertyId === selectedHotelId);
    } else if (selectedZoneId) {
      rooms = rooms.filter((room) =>
        hotels.some((hotel) => hotel.id === room.propertyId)
      );
    }

    return rooms;
  }, [selectedHotelId, selectedZoneId, allRooms, hotels]);

  // ✅ Filtro con pax
  const filteredRooms = useMemo(() => {
    return selectedPax !== null
      ? filterableRooms.filter((room) => room.pax === selectedPax)
      : filterableRooms;
  }, [filterableRooms, selectedPax]);

  const filteredRoomsByServices = useMemo(() => {
    return selectedServices.length > 0
      ? filteredRooms.filter((room) =>
          selectedServices.every((srv) => room.services?.includes(srv))
        )
      : filteredRooms;
  }, [selectedServices, filteredRooms]);

  const filteredRoomsByType = useMemo(() => {
    return selectedType.length > 0
      ? filteredRooms.filter((room) => selectedType.includes(room.type ?? ''))
      : filteredRooms;
  }, [selectedType, filteredRooms]);

  const uniqueServices = useMemo(() => {
    return Array.from(
      new Set(filterableRooms.flatMap((r) => r.services ?? []))
    );
  }, [filterableRooms]);

  const uniqueType = useMemo(() => {
    return Array.from(new Set(filterableRooms.flatMap((r) => r.type ?? [])));
  }, [filterableRooms]);

  // 🔁 Reset hotel/room si ya no son válidos
  useEffect(() => {
    if (selectedZoneId && !hotels.some((h) => h.id === selectedHotelId)) {
      setSelectedHotelId(null);
      setSelectedRoomId(null);
    }
  }, [selectedZoneId, hotels, selectedHotelId]);

  useEffect(() => {
    if (
      selectedHotelId &&
      !filteredRooms.some((r) => r.id === selectedRoomId)
    ) {
      setSelectedRoomId(null);
    }
  }, [selectedHotelId, filteredRooms, selectedRoomId]);

  // 🔁 Limpiar filtros inválidos
  useEffect(() => {
    setSelectedServices((curr) =>
      curr.filter((srv) => uniqueServices.includes(srv))
    );
  }, [uniqueServices]);

  useEffect(() => {
    setSelectedType((curr) => curr.filter((typ) => uniqueType.includes(typ)));
  }, [uniqueType]);

  // ⚠️ Mostrar mensaje si no hay habitaciones para el pax indicado
  useEffect(() => {
    if (selectedPax !== null && filteredRooms.length === 0) {
      setShowNoResultsMessage(true);
      setTimeout(() => {
        setSelectedPax(null);
        setShowNoResultsMessage(false);
      }, 2500);
    }
  }, [filteredRooms, selectedPax]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-10 text-dozeblue bg-white rounded-2xl shadow-lg mb-10"
    >
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
        <SeekerFilters
          zones={zones}
          hotels={hotels}
          filteredRooms={filteredRooms}
          uniqueServices={uniqueServices}
          uniqueType={uniqueType}
          selectedZoneId={selectedZoneId}
          selectedHotelId={selectedHotelId}
          selectedRoomId={selectedRoomId}
          selectedServices={selectedServices}
          selectedType={selectedType}
          selectedPax={selectedPax}
          setSelectedZoneId={setSelectedZoneId}
          setSelectedHotelId={setSelectedHotelId}
          setSelectedRoomId={setSelectedRoomId}
          setSelectedServices={setSelectedServices}
          setSelectedType={setSelectedType}
          setSelectedPax={setSelectedPax}
          loading={loading}
        />
      </div>

      <div className="flex flex-wrap justify-center pt-4 gap-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="min-w-[220px] text-dozeblue border border-dozeblue px-4 py-2 rounded-full hover:bg-dozeblue hover:text-white transition font-medium flex items-center justify-center gap-2 md:hidden"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {isFilterOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
          {isFilterOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() =>
            window.open(
              '/fns-booking-frame',
              '_blank',
              'width=600,height=700,scrollbars=yes,resizable=yes'
            )
          }
          className="min-w-[220px] text-dozeblue border border-dozeblue px-4 py-2 rounded-full hover:bg-dozeblue hover:text-white transition font-medium text-center"
        >
          Expandí tu búsqueda
        </button>

        <AnimatedButton
          text="Conocé Nuestras Zonas"
          sectionId="#zones"
          className="min-w-[220px]"
        />
      </div>

      {showNoResultsMessage && (
        <p className="text-center text-red-600 font-medium my-4">
          No hay habitaciones para esa cantidad de personas. Mostrando todas las
          disponibles.
        </p>
      )}

      <SeekerResults
        zones={zones}
        selectedZoneId={selectedZoneId}
        selectedHotelId={selectedHotelId}
        selectedRoomId={selectedRoomId}
        selectedServices={selectedServices}
        selectedType={selectedType}
        selectedPax={selectedPax}
        selectedHotel={selectedHotel}
        filteredRooms={filteredRooms}
        filteredRoomsByServices={filteredRoomsByServices}
        filteredRoomsByType={filteredRoomsByType}
        loading={loading}
      />
    </motion.section>
  );
}
