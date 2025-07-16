'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
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

  const [selectedRateIndex, setSelectedRateIndex] = useState<
    Record<string, number>
  >({});
  const [selectedPax, setSelectedPax] = useState<Record<string, number>>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  const reservedKeys = useMemo(() => {
    return new Set(
      reservations.map((r) => `${r.property_id}-${r.roomType}-${r.rooms}`)
    );
  }, [reservations]);

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
    roomTypeID: number
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
          items.forEach((item) => {
            item.rates.forEach((rate) => {
              rate.prices.forEach((p) => {
                if (p.price > 0) set.add(p.occupancy);
              });
            });
          });
          return Array.from(set).sort((a, b) => a - b);
        })();

        if (paxOptions.length === 0) {
          return (
            <div
              key={roomType}
              className="rounded-2xl border border-white/10 p-6 bg-[var(--background)] shadow-sm"
            >
              <h3 className="text-lg font-semibold text-dozeblue mb-2">
                {roomType}
              </h3>
              <p className="text-sm text-[var(--foreground)]">
                No hay precios disponibles para los huéspedes seleccionados.
              </p>
            </div>
          );
        }

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

        const reservedCountKey = `${propertyId}-${roomType}`;
        const reservedCount = reservedCountMap.get(reservedCountKey) || 0;
        const availabilityCount = items[0].availability;
        const noMoreAvailable = reservedCount >= availabilityCount;

        const selectedKey = `${propertyId}-${roomType}-${selectedIndex}`;
        const isSelectedReserved =
          reservedKeys.has(selectedKey) || noMoreAvailable;

        const rawImages = findRoomTypeImages(
          propertyId,
          roomTypeID,
          selectedProperty,
          allZones
        );
        const images: string[] =
          rawImages.length > 0 ? rawImages : [fallbackThumbnail];

        return (
          <div
            key={roomType}
            className="border border-gray-300 dark:border-white/10 rounded-2xl bg-[var(--background)] shadow-sm overflow-hidden transition-colors"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr]">
              <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dozegray/10">
                <h3 className="text-lg font-semibold text-dozeblue mb-2">
                  {roomType}
                </h3>
                <p className="text-sm flex items-center gap-1 text-[var(--foreground)] mb-3">
                  <Users size={16} className="text-dozeblue" /> Hasta {maxPax}{' '}
                  huésped{maxPax > 1 ? 'es' : ''}
                </p>

                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">
                    Habitación
                  </label>
                  <select
                    value={selectedIndex}
                    onChange={(e) =>
                      setSelectedRateIndex((prev) => ({
                        ...prev,
                        [roomType]: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue bg-white dark:bg-dozegray/10"
                  >
                    {rateTotals.map((sumPrice, idx) => {
                      const key = `${propertyId}-${roomType}-${idx}`;
                      const isReserved = reservedKeys.has(key);
                      const disabled = isReserved || noMoreAvailable;
                      return (
                        <option key={idx} value={idx} disabled={disabled}>
                          Habitación {idx + 1} – Total ${sumPrice}
                          {isReserved ? ' (ya reservada)' : ''}
                          {noMoreAvailable && !isReserved
                            ? ' (sin disponibilidad)'
                            : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Huéspedes
                  </label>
                  <select
                    value={pax}
                    onChange={(e) =>
                      setSelectedPax((prev) => ({
                        ...prev,
                        [roomType]: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 text-sm rounded-md border border-dozeblue bg-white dark:bg-dozegray/10"
                  >
                    {paxOptions.map((n) => (
                      <option key={n} value={n}>
                        {n} huésped{n > 1 ? 'es' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-sm">
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
                  <div className="mt-4 mb-4">
                    <div className="inline-flex gap-2 p-2 rounded-2xl bg-dozeblue/10">
                      {images.slice(0, 6).map((img: string, i: number) => (
                        <div
                          key={i}
                          onClick={() => {
                            setGalleryImages(images);
                            setGalleryIndex(i);
                            setIsGalleryOpen(true);
                          }}
                          className="w-20 h-16 relative rounded-lg overflow-hidden shadow ring-dozeblue cursor-pointer"
                        >
                          <Image
                            src={img || fallbackThumbnail}
                            alt={`Imagen ${i + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-[var(--foreground)]">
                    <div className="font-medium mb-1">
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
                        roomTypeID
                      )
                    }
                    className="bg-dozeblue text-white font-semibold px-6 py-3 rounded-lg hover:bg-dozeblue/90 transition-colors text-sm"
                    disabled={isSelectedReserved}
                  >
                    {isSelectedReserved
                      ? 'Ya reservada / Sin disponibilidad'
                      : 'Reservar ahora'}
                  </button>
                </div>
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
