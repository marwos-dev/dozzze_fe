'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { motion } from 'framer-motion';
import SeekerFilters from '@/components/ui/seeker/SeekerFilter';
import SeekerResults from '@/components/ui/seeker/SeekerResult';

export default function Seeker() {
  const { data: zones } = useSelector((state: RootState) => state.zones);

  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const hotels = selectedZoneId
    ? selectedZone?.properties || []
    : zones.flatMap((z) => z.properties);

  const selectedHotel = hotels.find((h) => h.id === selectedHotelId);

  const allRooms = zones.flatMap((z) =>
    z.properties.flatMap((p) =>
      p.rooms.map((r) => ({ ...r, propertyId: p.id }))
    )
  );

  const filteredRooms = selectedHotelId
    ? allRooms.filter((room) => room.propertyId === selectedHotelId)
    : selectedZoneId
      ? allRooms.filter((room) =>
          hotels.some((hotel) => hotel.id === room.propertyId)
        )
      : allRooms;

  const filteredRoomsByServices =
    selectedServices.length > 0
      ? filteredRooms.filter((room) =>
          selectedServices.every((srv) => room.services?.includes(srv))
        )
      : filteredRooms;

  const uniqueServices = Array.from(
    new Set(filteredRooms.flatMap((room) => room.services || []))
  );

  useEffect(() => {
    if (selectedZoneId && !hotels.some((h) => h.id === selectedHotelId)) {
      setSelectedHotelId(null);
      setSelectedRoomId(null);
    }
  }, [selectedZoneId]);

  useEffect(() => {
    if (
      selectedHotelId &&
      !filteredRooms.some((r) => r.id === selectedRoomId)
    ) {
      setSelectedRoomId(null);
    }
  }, [selectedHotelId]);

  useEffect(() => {
    setSelectedServices((curr) =>
      curr.filter((srv) => uniqueServices.includes(srv))
    );
  }, [filteredRooms, uniqueServices]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-10 text-dozeblue bg-white rounded-2xl shadow-lg mb-10"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Encontrá tu alojamiento ideal
      </h2>

      <SeekerFilters
        zones={zones}
        hotels={hotels}
        filteredRooms={filteredRooms}
        uniqueServices={uniqueServices}
        selectedZoneId={selectedZoneId}
        selectedHotelId={selectedHotelId}
        selectedRoomId={selectedRoomId}
        selectedServices={selectedServices}
        promoCode={promoCode}
        rooms={rooms}
        guests={guests}
        setSelectedZoneId={setSelectedZoneId}
        setSelectedHotelId={setSelectedHotelId}
        setSelectedRoomId={setSelectedRoomId}
        setSelectedServices={setSelectedServices}
        setPromoCode={setPromoCode}
        setRooms={setRooms}
        setGuests={setGuests}
      />
      {/* Botón expandir */}
      <div className="mt-6 text-center">
        <button
          onClick={() =>
            window.open(
              '/fns-booking-frame',
              '_blank',
              'width=600,height=700,scrollbars=yes,resizable=yes'
            )
          }
          className="text-dozeblue border border-dozeblue px-4 py-2 rounded-full hover:bg-dozeblue hover:text-white transition font-medium"
        >
          Expandí tu búsqueda
        </button>
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
        promoCode={promoCode}
        guests={guests}
      />
    </motion.section>
  );
}
