'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutList,
  Flag,
} from 'lucide-react';
import type { RoomType } from '@/types/roomType';
import { useLanguage } from '@/i18n/LanguageContext';

interface PropertyRoomsCarouselProps {
  rooms?: RoomType[];
  propertyName: string;
}

export default function PropertyRoomsCarousel({
  rooms = [],
  propertyName,
}: PropertyRoomsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { t } = useLanguage();

  const title = String(t('propertyCard.roomsCarousel.title'));
  const subtitle = String(t('propertyCard.roomsCarousel.subtitle'));
  const countSuffix = String(t('propertyCard.roomsCarousel.countSuffix'));
  const servicesLabel = String(t('propertyCard.roomsCarousel.servicesLabel'));
  const noServices = String(
    t('propertyCard.roomsCarousel.servicesFallbackText')
  );
  const noDescription = String(
    t('propertyCard.roomsCarousel.descriptionFallback')
  );
  const detailsCta = String(t('propertyCard.roomsCarousel.detailsCta'));
  const prevLabel = String(t('propertyCard.roomsCarousel.prev'));
  const nextLabel = String(t('propertyCard.roomsCarousel.next'));

  const visibleRooms = useMemo(
    () => rooms.filter((room): room is RoomType => Boolean(room)),
    [rooms]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollState = () => {
      setCanScrollLeft(container.scrollLeft > 8);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth <
          container.scrollWidth - 8
      );
    };

    updateScrollState();
    container.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [visibleRooms.length]);

  const handleScroll = (direction: 'next' | 'prev') => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount =
      container.firstElementChild?.clientWidth ??
      Math.min(container.clientWidth, 320);
    const offset = direction === 'next' ? scrollAmount : -scrollAmount;
    container.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (visibleRooms.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white/60 p-4 border border-dozebg1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-dozeblue font-semibold text-sm uppercase tracking-wide">
            <Sparkles className="w-4 h-4" />
            {title}
          </div>
          <p className="text-base font-semibold text-dozeblue">
            {subtitle}
          </p>
          <p className="text-sm text-dozegray">
            {visibleRooms.length} {countSuffix}
          </p>
        </div>

        <div className="hidden md:flex gap-2">
          <button
            type="button"
            onClick={() => handleScroll('prev')}
            aria-label={prevLabel}
            disabled={!canScrollLeft}
            className={`h-10 w-10 rounded-full border border-dozeblue text-dozeblue transition flex items-center justify-center ${
              canScrollLeft
                ? 'bg-white hover:bg-dozeblue hover:text-white'
                : 'bg-white/40 text-dozegray border-dozegray cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('next')}
            aria-label={nextLabel}
            disabled={!canScrollRight}
            className={`h-10 w-10 rounded-full border border-dozeblue text-dozeblue transition flex items-center justify-center ${
              canScrollRight
                ? 'bg-white hover:bg-dozeblue hover:text-white'
                : 'bg-white/40 text-dozegray border-dozegray cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none rounded-xl" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none rounded-xl" />

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-dozeblue/40 scrollbar-track-transparent snap-x snap-mandatory scroll-smooth"
        >
          {visibleRooms.map((room) => {
            const mainImage =
              room.images?.find((image) => image && image.startsWith('http')) ??
              '/logo.png';
            const services = room.services?.map((svc) => svc.name) ?? [];
            const visibleServices = services.slice(0, 3);
            const remainingServices = services.length - visibleServices.length;

            return (
              <article
                key={room.id}
                className="group min-w-[240px] sm:min-w-[260px] md:min-w-[280px] snap-center bg-white rounded-2xl border border-dozebg1 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={mainImage}
                    alt={`${room.name} - ${propertyName}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width: 768px) 280px, 240px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <span className="absolute bottom-2 left-3 text-xs font-medium text-white uppercase tracking-wide bg-black/50 px-2 py-1 rounded-full">
                    {propertyName}
                  </span>
                </div>

                <div className="flex flex-col gap-2 p-4 flex-1">
                  <h4 className="text-base font-semibold text-dozeblue line-clamp-1">
                    {room.name}
                  </h4>
                  <p className="text-sm text-dozegray leading-snug line-clamp-3">
                    {room.description || noDescription}
                  </p>

                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-semibold text-dozeblue uppercase tracking-wide">
                      <LayoutList className="w-4 h-4" />
                      {servicesLabel}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {visibleServices.length > 0 ? (
                        visibleServices.map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center rounded-full bg-dozebg1 px-3 py-1 text-xs font-medium text-dozeblue border border-dozeblue/10"
                          >
                            <Flag className="w-3 h-3 mr-1 text-dozeblue/70" />
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-dozegray">
                          {noServices}
                        </span>
                      )}
                      {remainingServices > 0 && (
                        <span className="inline-flex items-center rounded-full bg-dozeblue/10 px-3 py-1 text-xs font-medium text-dozeblue">
                          +{remainingServices}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="m-4 mt-0 inline-flex items-center justify-center rounded-full border border-dozeblue px-4 py-2 text-sm font-semibold text-dozeblue transition hover:bg-dozeblue hover:text-white"
                >
                  {detailsCta}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="flex md:hidden justify-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => handleScroll('prev')}
          aria-label={prevLabel}
          disabled={!canScrollLeft}
          className={`h-10 w-10 rounded-full border border-dozeblue text-dozeblue transition flex items-center justify-center ${
            canScrollLeft
              ? 'bg-white hover:bg-dozeblue hover:text-white'
              : 'bg-white/40 text-dozegray border-dozegray cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => handleScroll('next')}
          aria-label={nextLabel}
          disabled={!canScrollRight}
          className={`h-10 w-10 rounded-full border border-dozeblue text-dozeblue transition flex items-center justify-center ${
            canScrollRight
              ? 'bg-white hover:bg-dozeblue hover:text-white'
              : 'bg-white/40 text-dozegray border-dozegray cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
