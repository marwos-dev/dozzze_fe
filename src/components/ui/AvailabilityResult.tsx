'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Users, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/store';
import { addReservation } from '@/store/reserveSlice';
import type { AvailabilityItem } from '@/types/roomType';
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

const toMessage = (value: string | string[]) =>
  Array.isArray(value) ? value.join(' ') : value;

const fallbackThumbnail = '/logo.png';

function formatCurrency(value: number, currency: string = 'EUR') {
  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

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

type TranslateFn = (key: string) => string | string[];

const buildServiceKey = (
  propertyId: number,
  roomTypeId: number,
  serviceIdentifier: string | number
) => `${propertyId}-${roomTypeId}-${serviceIdentifier}`;

interface ServiceBadgeProps {
  service: PropertyService;
  index: number;
  propertyId: number;
  roomTypeId: number;
}

function ServiceBadge({
  service,
  index,
  propertyId,
  roomTypeId,
}: ServiceBadgeProps) {
  const iconCode =
    normalizeServiceCode(service.code) ?? normalizeServiceCode(service.name);
  const IconComponent = getServiceIcon(iconCode ?? '') ?? Users;

  const tooltipContent =
    service.description || service.name || service.code || 'Servicio';
  const baseKey = service.id ?? `${iconCode || 'default'}-${index}`;
  const serviceKey = buildServiceKey(propertyId, roomTypeId, baseKey);
  const tooltipId = `service-${serviceKey}`;

  return (
    <div className="relative">
      <div
        className="flex w-[82px] max-w-[90px] flex-col items-center gap-2 text-center text-[11px] font-medium text-[var(--foreground)]/80"
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipContent}
      >
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--icon-badge-border)] bg-[var(--icon-badge-bg)] text-[var(--icon-badge-color)] shadow-sm"
        >
          <IconComponent size={20} aria-hidden />
        </span>
        <span className="w-full truncate" title={service.name || service.code}>
          {service.name || service.code}
        </span>
      </div>
      <Tooltip id={tooltipId} />
    </div>
  );
}

interface ServicesListProps {
  services: PropertyService[];
  propertyId: number;
  roomTypeId: number;
}

function ServicesList({
  services,
  propertyId,
  roomTypeId,
}: ServicesListProps) {
  if (!services.length) return null;

  return (
    <section className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground)]/60">
        Servicios incluidos
      </p>
      <div className="flex flex-wrap gap-4">
        {services.map((service, idx) => (
          <ServiceBadge
            key={`${service.id ?? service.code ?? idx}`}
            service={service}
            index={idx}
            propertyId={propertyId}
            roomTypeId={roomTypeId}
          />
        ))}
      </div>
    </section>
  );
}

interface RateSelectorProps {
  totals: number[];
  selectedIndex: number;
  recommendedIndex: number;
  onChange: (value: number) => void;
  disableAll: boolean;
  reservedKeys: Set<string>;
  propertyId: number;
  roomType: string;
}

function RateSelector({
  totals,
  selectedIndex,
  recommendedIndex,
  onChange,
  disableAll,
  reservedKeys,
  propertyId,
  roomType,
}: RateSelectorProps) {
  if (!totals.length) return null;

  return (
    <section className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground)]/60">
        Elegí tu tarifa
      </span>
      <div className="flex flex-wrap gap-2">
        {totals.map((sumPrice, idx) => {
          const key = `${propertyId}-${roomType}-${idx}`;
          const disabled = disableAll || reservedKeys.has(key);
          const isActive = idx === selectedIndex;
          const isRecommended = idx === recommendedIndex;

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => !disabled && onChange(idx)}
              className={`group flex min-w-[160px] flex-1 flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-dozeblue ${
                isActive
                  ? 'border-dozeblue bg-dozeblue/10 shadow-sm ring-1 ring-dozeblue/40'
                  : 'border-white/20 bg-white/5 hover:border-dozeblue/50 hover:bg-white/10'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span className="text-sm font-semibold text-[var(--foreground)]">
                Habitación {idx + 1}
              </span>
              <span className="text-base font-bold text-dozeblue group-hover:text-dozeblue">
                {formatCurrency(sumPrice)}
              </span>
              {isRecommended && (
                <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
                  Mejor precio
                </span>
              )}
              {disabled && (
                <span className="text-[11px] font-medium text-red-500">
                  Sin disponibilidad
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

interface PaxSelectorProps {
  options: number[];
  selected: number;
  onChange: (value: number) => void;
}

function PaxSelector({ options, selected, onChange }: PaxSelectorProps) {
  if (!options.length) return null;

  return (
    <section className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground)]/60">
        Cantidad de huéspedes
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === selected;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dozeblue ${
                isActive
                  ? 'border-dozeblue bg-dozeblue/15 text-dozeblue'
                  : 'border-white/20 bg-white/5 text-[var(--foreground)] hover:border-dozeblue/50 hover:text-dozeblue'
              }`}
            >
              <Users size={16} aria-hidden />
              {option} huésped{option > 1 ? 'es' : ''}
            </button>
          );
        })}
      </div>
    </section>
  );
}

interface PaxTotalsRowProps {
  options: number[];
  selectedIndex: number;
  items: AvailabilityItem[];
}

function PaxTotalsRow({
  options,
  selectedIndex,
  items,
}: PaxTotalsRowProps) {
  if (!options.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((occupancy) => {
        const totalByOcc = items.reduce((sum, item) => {
          const priceObj = item.rates[selectedIndex]?.prices.find(
            (pr) => pr.occupancy === occupancy
          );
          return sum + (priceObj?.price || 0);
        }, 0);

        return (
          <span
            key={occupancy}
            className="inline-flex items-center rounded-full bg-dozeblue/15 px-3 py-1 text-xs font-medium text-dozeblue"
          >
            {occupancy} pax · {formatCurrency(totalByOcc)}
          </span>
        );
      })}
    </div>
  );
}

interface RoomImageProps {
  currentImage: string;
  onOpenGallery: () => void;
  roomType: string;
  availabilityLeft: number;
  totalAvailability: number;
}

function RoomImage({
  currentImage,
  onOpenGallery,
  roomType,
  availabilityLeft,
  totalAvailability,
}: RoomImageProps) {
  const limitedStock = availabilityLeft <= 2;

  return (
    <div
      className="relative h-[240px] cursor-zoom-in overflow-hidden rounded-3xl sm:h-full"
      onClick={onOpenGallery}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenGallery();
        }
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-dozeblue shadow">
          {availabilityLeft}/{totalAvailability} disponibles
        </span>
        {limitedStock && (
          <span className="inline-flex items-center rounded-full bg-amber-500/90 px-3 py-1 text-[11px] font-semibold text-black shadow">
            Últimas habitaciones
          </span>
        )}
      </div>

      <button
        type="button"
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-dozeblue shadow-lg transition hover:bg-white"
        onClick={(event) => {
          event.stopPropagation();
          onOpenGallery();
        }}
        aria-label={`Ver galería de ${roomType}`}
      >
        <Camera size={16} aria-hidden />
        Ver galería
      </button>
    </div>
  );
}

interface RoomCardProps {
  roomType: string;
  items: AvailabilityItem[];
  carouselIndex: number;
  guestsFromSearch?: number;
  selectedRateIndex?: number;
  onRateChange: (value: number) => void;
  selectedPax?: number;
  onPaxChange: (value: number) => void;
  reservedKeys: Set<string>;
  reservedCount: number;
  onReserve: (
    roomType: string,
    rateIndex: number,
    rateId: number,
    pax: number,
    total: number,
    propertyId: number,
    roomTypeID: number,
    images: string[],
    services: PropertyService[]
  ) => void;
  openGallery: (images: string[], initialIndex: number) => void;
  selectedProperty: Property | null | undefined;
  allZones: Zone[];
  t: TranslateFn;
}

const RoomCard: React.FC<RoomCardProps> = ({
  roomType,
  items,
  carouselIndex,
  guestsFromSearch,
  selectedRateIndex,
  onRateChange,
  selectedPax,
  onPaxChange,
  reservedKeys,
  reservedCount,
  onReserve,
  openGallery,
  selectedProperty,
  allZones,
  t,
}) => {
  const firstItem = items[0];
  const propertyId = firstItem.property_id;
  const roomTypeId = firstItem.room_type_id;
  const totalAvailability = firstItem.availability;

  const paxOptions = useMemo(() => {
    const set = new Set<number>();
    items.forEach((item) =>
      item.rates.forEach((rate) =>
        rate.prices.forEach((price) => {
          if (price.price > 0) set.add(price.occupancy);
        })
      )
    );
    return Array.from(set).sort((a, b) => a - b);
  }, [items]);

  const hasPaxOptions = paxOptions.length > 0;
  const maxPax = hasPaxOptions ? paxOptions[paxOptions.length - 1] : 0;
  const defaultPax = hasPaxOptions
    ? typeof guestsFromSearch === 'number' &&
      paxOptions.includes(guestsFromSearch)
      ? guestsFromSearch
      : paxOptions[0]
    : undefined;
  const pax = selectedPax ?? defaultPax;

  const rateTotals =
    typeof pax === 'number'
      ? firstItem.rates.map((_, idx) =>
          items.reduce((sum, item) => {
            const priced =
              item.rates[idx]?.prices.find(
                (price) => price.occupancy === pax
              )?.price ?? 0;
            return sum + priced;
          }, 0)
        )
      : [];

  if (!hasPaxOptions || typeof pax !== 'number' || !rateTotals.length) {
    return null;
  }

  const minValue = Math.min(...rateTotals);
  const recommendedIndex = rateTotals.findIndex((value) => value === minValue);
  const normalizedRecommendedIndex =
    recommendedIndex >= 0 ? recommendedIndex : 0;

  const selectedIndex =
    selectedRateIndex !== undefined
      ? selectedRateIndex
      : normalizedRecommendedIndex;
  const safeSelectedIndex =
    selectedIndex >= 0 && selectedIndex < rateTotals.length
      ? selectedIndex
      : 0;

  const total = rateTotals[safeSelectedIndex] ?? 0;

  const reservedKey = `${propertyId}-${roomType}-${safeSelectedIndex}`;
  const noMoreAvailable = reservedCount >= totalAvailability;
  const isSelectedReserved = reservedKeys.has(reservedKey) || noMoreAvailable;
  const availabilityLeft = Math.max(totalAvailability - reservedCount, 0);

  const rawImages = findRoomTypeImages(
    propertyId,
    roomTypeId,
    selectedProperty,
    allZones
  );
  const images =
    Array.isArray(rawImages) && rawImages.length > 0
      ? rawImages
      : [fallbackThumbnail];
  const imgIndex = images.length > 0 ? carouselIndex % images.length : 0;
  const currentImage = images[imgIndex];

  const services = firstItem.services?.length
    ? firstItem.services
    : findRoomTypeServices(
        propertyId,
        roomTypeId,
        selectedProperty,
        allZones
      );

  const dedupedServices = (() => {
    const seen = new Set<string>();
    const deduped: PropertyService[] = [];
    services.forEach((service, idx) => {
      const key =
        normalizeServiceCode(service.code) ??
        normalizeServiceCode(service.name) ??
        (service.id ? `ID-${service.id}` : `IDX-${idx}`);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(service);
      }
    });
    return deduped;
  })();

  const paxLabel = `${pax} huésped${pax > 1 ? 'es' : ''}`;
  const reserveLabel = toMessage(t('availability.reserveNow'));
  const reservedOrUnavailableLabel = toMessage(
    t('availability.reservedOrUnavailable')
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -24 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-3xl border border-white/15 bg-[var(--background)] shadow-xl shadow-black/5"
    >
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-[320px_1fr] sm:p-6">
        <RoomImage
          currentImage={currentImage}
          roomType={roomType}
          availabilityLeft={availabilityLeft}
          totalAvailability={totalAvailability}
          onOpenGallery={() => openGallery(images, imgIndex)}
        />

        <div className="flex flex-col justify-between gap-6">
          <header className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="text-xl font-semibold text-dozeblue">
                {roomType}
              </h3>

              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[var(--foreground)]/80">
                <Users size={14} className="text-dozeblue" aria-hidden />
                Capacidad hasta {maxPax} huésped{maxPax > 1 ? 'es' : ''}
              </span>
            </div>
            <p className="text-sm text-[var(--foreground)]/70">
              Ideal para {paxLabel}. Ajustá huéspedes y tarifa para ver el mejor
              precio disponible.
            </p>
          </header>

          <ServicesList
            services={dedupedServices}
            propertyId={propertyId}
            roomTypeId={roomTypeId}
          />

          <div className="space-y-6">
            <RateSelector
              totals={rateTotals}
              selectedIndex={safeSelectedIndex}
              recommendedIndex={normalizedRecommendedIndex}
              onChange={onRateChange}
              disableAll={noMoreAvailable}
              reservedKeys={reservedKeys}
              propertyId={propertyId}
              roomType={roomType}
            />

            <PaxSelector
              options={paxOptions}
              selected={pax}
              onChange={onPaxChange}
            />

            <PaxTotalsRow
              options={paxOptions}
              selectedIndex={safeSelectedIndex}
              items={items}
            />
          </div>

          <footer className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--foreground)]/85">
              <div className="font-medium">
                {paxLabel} · Habitación {safeSelectedIndex + 1} seleccionada
              </div>
              <div className="text-lg font-semibold text-dozeblue">
                Total a pagar: {formatCurrency(total)}
              </div>
              {noMoreAvailable && (
                <p className="text-xs font-medium text-red-500">
                  Lo sentimos, no hay más disponibilidad para esta habitación.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
              onReserve(
                roomType,
                safeSelectedIndex,
                firstItem.rates[safeSelectedIndex].rate_id,
                pax,
                total,
                propertyId,
                roomTypeId,
                images,
                dedupedServices
              )
              }
              disabled={isSelectedReserved}
              className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors sm:w-auto ${
                isSelectedReserved
                  ? 'cursor-not-allowed bg-white/10 text-[var(--foreground)]/50'
                  : 'bg-dozeblue text-white hover:bg-dozeblue/90'
              }`}
            >
              {isSelectedReserved ? reservedOrUnavailableLabel : reserveLabel}
            </button>
          </footer>
        </div>
      </div>
    </motion.article>
  );
};

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => prev + 1);
    }, 4000);

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
        reservations.map((reservation) => {
          return `${reservation.property_id}-${reservation.roomType}-${reservation.rooms}`;
        })
      ),
    [reservations]
  );

  const reservedCountMap = useMemo(() => {
    const map = new Map<string, number>();
    reservations.forEach((reservation) => {
      const key = `${reservation.property_id}-${reservation.roomType}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [reservations]);

  const handleReserve = useCallback(
    (
      roomType: string,
      rateIndex: number,
      rateId: number,
      pax: number,
      total: number,
      propertyId: number,
      roomTypeID: number,
      images: string[],
      services: PropertyService[]
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
          services,
        })
      );

      router.push('/reserve');
    },
    [dispatch, range, router]
  );

  const openGallery = useCallback((images: string[], initialIndex: number) => {
    setGalleryImages(images);
    setGalleryIndex(initialIndex);
    setIsGalleryOpen(true);
  }, []);

  return (
    <div className="mt-6 space-y-8">
      <AnimatePresence initial={false}>
        {grouped.map(([roomType, items]) => {
          const propertyId = items[0].property_id;
          const reservedCount =
            reservedCountMap.get(`${propertyId}-${roomType}`) || 0;

          return (
            <RoomCard
              key={`${propertyId}-${roomType}`}
              roomType={roomType}
              items={items}
              carouselIndex={carouselIndex}
              guestsFromSearch={guestsFromSearch}
              selectedRateIndex={selectedRateIndex[roomType]}
              onRateChange={(value) =>
                setSelectedRateIndex((prev) => ({
                  ...prev,
                  [roomType]: value,
                }))
              }
              selectedPax={selectedPax[roomType]}
              onPaxChange={(value) =>
                setSelectedPax((prev) => ({
                  ...prev,
                  [roomType]: value,
                }))
              }
              reservedKeys={reservedKeys}
              reservedCount={reservedCount}
              onReserve={handleReserve}
              openGallery={openGallery}
              selectedProperty={selectedProperty}
              allZones={allZones}
              t={t}
            />
          );
        })}
      </AnimatePresence>

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
