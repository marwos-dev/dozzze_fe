'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/store';
import { addReservation } from '@/store/reserveSlice';
import { AvailabilityItem } from '@/types/roomType';
import {
  selectAvailability,
  selectLastAvailabilityParams,
  selectSelectedProperty,
} from '@/store/selectors/propertiesSelectors';
import ImageGalleryModal from '@/components/ui/modals/ImageGaleryModal';
import type { Property } from '@/types/property';
import type { Zone } from '@/types/zone';
const fallbackThumbnail = '/logo.png';

function findRoomTypeImages(
  propertyId: number,
  roomTypeId: number,
  selectedProperty: Property | null | undefined,
  allZones: Zone[]
): string[] {
  if (selectedProperty?.id === propertyId) {
    const roomType = selectedProperty.room_types?.find(
      (rt) => rt.id === roomTypeId
    );
    if (roomType?.images?.length) return roomType.images;
  }

  for (const zone of allZones) {
    const property = zone.properties?.find((p) => p.id === propertyId);
    const roomType = property?.room_types?.find((rt) => rt.id === roomTypeId);
    if (roomType?.images?.length) return roomType.images;
  }

  return [];
}

export default function AvailabilityResult() {
  const dispatch = useDispatch();
  const router = useRouter();
  const availability = useSelector(selectAvailability);
  const range = useSelector(selectLastAvailabilityParams);
  const reservations = useSelector((state: RootState) => state.reserve.data);
  const guestsFromSearch = range?.guests;

  const selectedProperty = useSelector(selectSelectedProperty);
  const allZones = useSelector((state: RootState) => state.zones.data);

  const [selectedRateIndex, setSelectedRateIndex] = useState<
    Record<string, number>
  >({});
  const [selectedPax, setSelectedPax] = useState<Record<string, number>>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const allZones = useSelector((state: RootState) => state.zones.data);
  const selectedProperty = useSelector(selectSelectedProperty);

  const grouped = useMemo(() => {
    const map = new Map<string, AvailabilityItem[]>();
    availability.forEach((item) => {
      const group = map.get(item.room_type) || [];
      group.push(item);
      map.set(item.room_type, group);
    });
    return Array.from(map.entries());
  }, [availability]);

  const reservedKeys = useMemo(
    () =>
      new Set(
        reservations.map((r) => `${r.property_id}-${r.roomType}-${r.rooms}`)
      ),
    [reservations]
  );

  const reservedCountMap = useMemo(() => {
    const map = new Map<string, number>();
    reservations.forEach((r) => {
      const key = `${r.property_id}-${r.roomType}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [reservations]);

  const handleReserve = (
    roomType: string,
    rateIndex: number,
    pax: number,
    total: number,
    propertyId: number,
    roomTypeID: number,
    images: string[]
  ) => {
    if (!range?.check_in || !range?.check_out) return;

    dispatch(
      addReservation({
        property_id: propertyId,
        check_in: range.check_in,
        check_out: range.check_out,
        rooms: rateIndex,
        pax_count: pax,
        total_price: total,
        channel: 'WEB',
        currency: 'EUR',
        roomType,
        roomTypeID,
        images,
      })
    );

    router.push('/reserve');
  };

  return (
    <div className="space-y-6 mt-6">
      {grouped.map(([roomType, items]) => {
        const rates = items[0].rates;
        const propertyId = items[0].property_id;
        const roomTypeID = items[0].room_type_id;
        const ratesCount = rates.length;

        const paxOptions = (() => {
          const set = new Set<number>();
          items.forEach((item) =>
            item.rates.forEach((rate) =>
              rate.prices.forEach((p) => {
                if (p.price > 0) set.add(p.occupancy);
              })
            )
          );
          return Array.from(set).sort((a, b) => a - b);
        })();

        if (paxOptions.length === 0) return null;

        const maxPax = paxOptions[paxOptions.length - 1];
        const defaultPax = paxOptions.includes(guestsFromSearch || 0)
          ? guestsFromSearch!
          : paxOptions[0];
        const pax = selectedPax[roomType] ?? defaultPax;

        const rateTotals = Array.from({ length: ratesCount }).map((_, idx) =>
          items.reduce((sum, item) => {
            const priceObj = item.rates[idx].prices.find(
              (p) => p.occupancy === pax
            );
            return sum + (priceObj?.price || 0);
          }, 0)
        );

        const defaultIndex = rateTotals.indexOf(Math.min(...rateTotals));
        const selectedIndex = selectedRateIndex[roomType] ?? defaultIndex;
        const total = rateTotals[selectedIndex];

        const reservedCount =
          reservedCountMap.get(`${propertyId}-${roomType}`) || 0;
        const noMoreAvailable = reservedCount >= items[0].availability;
        const selectedKey = `${propertyId}-${roomType}-${selectedIndex}`;
        const isSelectedReserved =
          reservedKeys.has(selectedKey) || noMoreAvailable;

        const rawImages = findRoomTypeImages(
          propertyId,
          roomTypeID,
          selectedProperty,
          allZones
        );
        const images =
          Array.isArray(rawImages) && rawImages.length > 0
            ? rawImages
            : [fallbackThumbnail];


        const imgIndex = images.length > 0 ? carouselIndex % images.length : 0;
        const currentImage = images[imgIndex];

        return (
          <div
            key={roomType}
            className="grid grid-cols-1 sm:grid-cols-[300px_1fr] overflow-hidden rounded-2xl border bg-[var(--background)] shadow"
          >
            <div
              className="relative h-[300px] sm:h-full cursor-pointer overflow-hidden"
              onClick={() => {
                setGalleryImages(images);
                setGalleryIndex(imgIndex);
                setIsGalleryOpen(true);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentImage}
                    alt={`Habitación ${roomType}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col justify-between p-6 gap-4 border-l-[4px] border-dozeblue">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-dozeblue">

                  {roomType}
                </h3>
                <p className="flex items-center text-sm text-[var(--foreground)] gap-1">
                  <Users size={16} className="text-dozeblue" /> Hasta {maxPax}{' '}
                  huésped{maxPax > 1 ? 'es' : ''}
                </p>

                {/* Servicios disponibles (mockup) */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    'Wifi gratis',
                    'Desayuno',
                    'Estacionamiento',
                    'Piscina',
                  ].map((service) => (
                    <span
                      key={service}
                      className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedIndex}
                    onChange={(e) =>
                      setSelectedRateIndex((prev) => ({
                        ...prev,
                        [roomType]: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 text-sm rounded-md border border-dozeblue bg-white dark:bg-dozegray/10"
                  >
                    {rateTotals.map((sumPrice, idx) => {
                      const key = `${propertyId}-${roomType}-${idx}`;
                      const disabled = reservedKeys.has(key) || noMoreAvailable;
                      return (
                        <option key={idx} value={idx} disabled={disabled}>
                          Habitación {idx + 1} – Total ${sumPrice}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    value={pax}
                    onChange={(e) =>
                      setSelectedPax((prev) => ({
                        ...prev,
                        [roomType]: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 text-sm rounded-md border border-dozeblue bg-white dark:bg-dozegray/10"
                  >
                    {paxOptions.map((n) => (
                      <option key={n} value={n}>
                        {n} huésped{n > 1 ? 'es' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {paxOptions.map((occ) => {
                    const totalByOcc = items.reduce((sum, item) => {
                      const priceObj = item.rates[selectedIndex].prices.find(
                        (pr) => pr.occupancy === occ
                      );
                      return sum + (priceObj?.price || 0);
                    }, 0);
                    return (
                      <span
                        key={occ}
                        className="px-2 py-1 rounded-full bg-dozeblue/30 border border-dozeblue text-xs font-medium"
                      >
                        {occ} pax Total ${totalByOcc}
                      </span>
                    );
                  })}

                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-[var(--foreground)]">
                  <div className="font-medium">
                    {Array(pax).fill('👤').join(' ')} – Habitación{' '}
                    {selectedIndex + 1} seleccionada
                  </div>
                  <div className="text-base font-semibold text-dozeblue">
                    Total a pagar: ${total}
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleReserve(
                      roomType,
                      selectedIndex,
                      pax,
                      total,
                      propertyId,
                      roomTypeID,
                      images
                    )
                  }
                  disabled={isSelectedReserved}
                  className="bg-dozeblue text-white font-semibold px-6 py-3 rounded-lg hover:bg-dozeblue/90 transition-colors text-sm"
                >
                  {isSelectedReserved
                    ? 'Ya reservada / Sin disponibilidad'
                    : 'Reservar ahora'}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {isGalleryOpen && (
        <ImageGalleryModal
          images={galleryImages}
          initialIndex={galleryIndex}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </div>
  );
}
