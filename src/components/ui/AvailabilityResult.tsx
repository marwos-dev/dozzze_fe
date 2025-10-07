'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/store';
import { addReservation } from '@/store/reserveSlice';
import { showToast } from '@/store/toastSlice';
import { AvailabilityItem } from '@/types/roomType';
import {
  selectAvailability,
  selectLastAvailabilityParams,
  selectSelectedProperty,
} from '@/store/selectors/propertiesSelectors';
import ImageGalleryModal from '@/components/ui/modals/ImageGaleryModal';
import { Tooltip } from 'react-tooltip';
import { getServiceIcon } from '@/icons';
import type { Property, PropertyService } from '@/types/property';
import type { Zone } from '@/types/zone';
import { useLanguage } from '@/i18n/LanguageContext';
import { addRoomTypeService } from '@/services/roomApi';

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

function findRoomTypeServices(
  propertyId: number,
  roomTypeId: number,
  selectedProperty: Property | null | undefined,
  allZones: Zone[]
): PropertyService[] {
  if (selectedProperty?.id === propertyId) {
    const roomType = selectedProperty.room_types?.find(
      (rt) => rt.id === roomTypeId
    );
    if (roomType?.services?.length) return roomType.services;
  }

  for (const zone of allZones) {
    const property = zone.properties?.find((p) => p.id === propertyId);
    const roomType = property?.room_types?.find((rt) => rt.id === roomTypeId);
    if (roomType?.services?.length) return roomType.services;
  }

  return [];
}

function normalizeServiceCode(value?: string) {
  return value
    ?.trim()
    .toUpperCase()
    .replace(/[\s/-]+/g, '_');
}

export default function AvailabilityResult() {
  const dispatch = useDispatch();
  const router = useRouter();
  const availability = useSelector(selectAvailability);
  const range = useSelector(selectLastAvailabilityParams);
  const reservations = useSelector((state: RootState) => state.reserve.data);
  const guestsFromSearch = range?.guests;

  const { t } = useLanguage();

  const [selectedRateIndex, setSelectedRateIndex] = useState<
    Record<string, number>
  >({});
  const [selectedPax, setSelectedPax] = useState<Record<string, number>>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [serviceRequestState, setServiceRequestState] = useState<
    Record<string, 'idle' | 'loading' | 'success' | 'error'>
  >({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setServiceRequestState({});
  }, [availability]);

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
    rateId: number,
    pax: number,
    total: number,
    propertyId: number,
    roomTypeID: number,
    images: string[]
  ) => {
    if (!range?.check_in || !range?.check_out) return;

    const roundedTotal = Number(total.toFixed(2));

    dispatch(
      addReservation({
        property_id: propertyId,
        check_in: range.check_in,
        check_out: range.check_out,
        rooms: rateIndex,
        rate_id: rateId,
        pax_count: pax,
        total_price: roundedTotal,
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

        const services =
          items[0].services?.length
            ? items[0].services
            : findRoomTypeServices(
                propertyId,
                roomTypeID,
                selectedProperty,
                allZones
              );

        const seenServiceKeys = new Set<string>();
        const dedupedServices: PropertyService[] = [];
        services.forEach((svc, idx) => {
          const key =
            normalizeServiceCode(svc.code) ??
            normalizeServiceCode(svc.name) ??
            (svc.id ? `ID-${svc.id}` : `IDX-${idx}`);
          if (!seenServiceKeys.has(key)) {
            seenServiceKeys.add(key);
            dedupedServices.push(svc);
          }
        });

        const buildServiceKey = (serviceIdentifier: string | number) =>
          `${propertyId}-${roomTypeID}-${serviceIdentifier}`;

        const handleServiceBadgeClick = async (
          service: PropertyService,
          serviceKey: string
        ) => {
          if (!roomTypeID || !service?.code) return;

          setServiceRequestState((prev) => {
            if (prev[serviceKey] === 'loading') return prev;
            return { ...prev, [serviceKey]: 'loading' };
          });

          try {
            await addRoomTypeService(roomTypeID, {
              code: service.code,
              name: service.name,
              description: service.description,
            });

            setServiceRequestState((prev) => ({
              ...prev,
              [serviceKey]: 'success',
            }));

            dispatch(
              showToast({
                message: t('availability.serviceAdded'),
                color: 'green',
              })
            );
          } catch (error) {
            console.error('Error adding room type service', error);
            setServiceRequestState((prev) => ({
              ...prev,
              [serviceKey]: 'error',
            }));

            dispatch(
              showToast({
                message: t('availability.serviceAddError'),
                color: 'red',
              })
            );
          }
        };

        const displayServices = dedupedServices;

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

                {/* Íconos SVG */}
                {displayServices.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-1 items-center">
                    {displayServices.map((service, idx) => {
                      const iconCode =
                        normalizeServiceCode(service.code) ??
                        normalizeServiceCode(service.name) ??
                        '';
                      const Icon = getServiceIcon(iconCode);
                      const tooltipId = `service-${propertyId}-${roomTypeID}-${idx}`;
                      const tooltipContent =
                        service.description || service.name || service.code || 'Servicio';
                      const baseKey = service.id ?? `${iconCode || 'default'}-${idx}`;
                      const serviceKey = buildServiceKey(baseKey);
                      const status = serviceRequestState[serviceKey] ?? 'idle';
                      const isLoading = status === 'loading';
                      const isSuccess = status === 'success';
                      const isError = status === 'error';
                      const badgeStateClasses = isSuccess
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-300 bg-emerald-500/10'
                        : isError
                          ? 'border-red-500 text-red-500 dark:text-red-300 bg-red-500/10'
                          : '';
                      const isDisabled = isLoading || isSuccess;

                      return (
                        <div key={serviceKey} className="relative group">
                          <div
                            role="button"
                            tabIndex={0}
                            aria-pressed={isSuccess}
                            aria-busy={isLoading}
                            data-service-state={status}
                            className={`flex flex-col items-center gap-2 w-[82px] max-w-[90px] text-center text-[10px] font-medium text-[var(--foreground)]/80 ${
                              isDisabled ? 'cursor-default' : 'cursor-pointer'
                            }`}
                            onClick={() =>
                              !isDisabled &&
                              void handleServiceBadgeClick(service, serviceKey)
                            }
                            onKeyDown={(event) => {
                              if (isDisabled) return;
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                void handleServiceBadgeClick(service, serviceKey);
                              }
                            }}
                          >
                            <div
                              className={`w-10 h-10 flex items-center justify-center rounded-full border border-[var(--icon-badge-border)] bg-[var(--icon-badge-bg)] text-[var(--icon-badge-color)] shadow-sm transition-colors duration-200 ${
                                isDisabled
                                  ? 'cursor-default'
                                  : 'cursor-pointer hover:border-[var(--icon-badge-color)]'
                              } ${isLoading ? 'animate-pulse' : ''} ${badgeStateClasses}`}
                              data-tooltip-id={tooltipId}
                              data-tooltip-content={tooltipContent}
                            >
                              <Icon size={20} aria-hidden />
                            </div>
                            <span
                              className="text-[11px] leading-tight text-center truncate w-full"
                              title={service.name || service.code}
                            >
                              {service.name || service.code}
                            </span>
                          </div>
                          <Tooltip id={tooltipId} />
                        </div>
                      );
                    })}
                  </div>
                )}

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
                          Habitación {idx + 1} – Total ${sumPrice.toFixed(2)}
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
                        {occ} pax Total ${totalByOcc.toFixed(2)}
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
                    Total a pagar: ${total.toFixed(2)}
                  </div>
                </div>
                  <button
                    onClick={() =>
                      handleReserve(
                        roomType,
                        selectedIndex,
                        rates[selectedIndex].rate_id,
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
                      ? t('availability.reservedOrUnavailable')
                      : t('availability.reserveNow')}
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
