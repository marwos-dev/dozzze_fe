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
  const [isFilterOpen, setIsFilterOpen] = useState(initialFilterOpen);

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

  const filteredRooms = useMemo(() => {
    if (selectedHotelId) {
      return allRooms.filter((room) => room.propertyId === selectedHotelId);
    }
    if (selectedZoneId) {
      return allRooms.filter((room) =>
        hotels.some((hotel) => hotel.id === room.propertyId)
      );
    }
    return allRooms;
  }, [selectedHotelId, selectedZoneId, allRooms, hotels]);

  const filteredRoomsByServices = useMemo(() => {
    if (selectedServices.length > 0) {
      return filteredRooms.filter((room) =>
        selectedServices.every((srv) => room.services?.includes(srv))
      );
    }
    return filteredRooms;
  }, [selectedServices, filteredRooms]);

  const uniqueServices = useMemo(() => {
    return Array.from(
      new Set(filteredRooms.flatMap((room) => room.services || []))
    );
  }, [filteredRooms]);

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

  useEffect(() => {
    setSelectedServices((curr) => {
      const filtered = curr.filter((srv) => uniqueServices.includes(srv));
      return filtered.length !== curr.length ? filtered : curr;
    });
  }, [uniqueServices]);

  useEffect(() => {
    setSelectedRoomId(null);
  }, [selectedServices]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-10 text-dozeblue bg-white rounded-2xl shadow-lg mb-10"
    >
      {/* Filtros visibles en desktop y toggleables en mobile */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
        <SeekerFilters
          zones={zones}
          hotels={hotels}
          filteredRooms={filteredRooms}
          uniqueServices={uniqueServices}
          selectedZoneId={selectedZoneId}
          selectedHotelId={selectedHotelId}
          selectedRoomId={selectedRoomId}
          selectedServices={selectedServices}
          setSelectedZoneId={setSelectedZoneId}
          setSelectedHotelId={setSelectedHotelId}
          setSelectedRoomId={setSelectedRoomId}
          setSelectedServices={setSelectedServices}
          loading={loading}
        />
      </div>

      {/* Botones adicionales */}
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

      <SeekerResults
        zones={zones}
        selectedZoneId={selectedZoneId}
        selectedHotelId={selectedHotelId}
        selectedRoomId={selectedRoomId}
        selectedServices={selectedServices}
        selectedHotel={selectedHotel}
        filteredRooms={filteredRooms}
        filteredRoomsByServices={filteredRoomsByServices}
        loading={loading}
      />
    </motion.section>
  );
}
