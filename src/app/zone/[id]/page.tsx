'use client';

import { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { getZoneById, setSelectedZone } from '@/store/zoneSlice';
import PropertiesCard from '@/components/ui/cards/PropertiesCard/ProperitesCard';
import ZoneBanner from '@/components/ui/banners/ZoneBanner';
import { parseAreaToCoordinates } from '@/utils/mapUtils/parseAreaToCoordiantes';
import { extractPoints } from '@/utils/mapUtils/extractPoints';
import { Property } from '@/types/property';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ZoneHeaderSkeleton from '@/components/ui/skeletons/ZoneHeaderSkeleton';
import ZoneBannerSkeleton from '@/components/ui/skeletons/ZoneBannerSkeleton';
import PropertiesCardSkeleton from '@/components/ui/skeletons/PropertyCardSkeleton';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Building2,
  LayoutGrid,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: number }>;
}

export default function ZoneDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useLanguage();

  const {
    selectedZone,
    data: allZones,
    loading,
    error,
  } = useSelector((state: RootState) => state.zones);

  useEffect(() => {
    if (!selectedZone) {
      dispatch(getZoneById(id));
    }
  }, [id, dispatch, selectedZone]);

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZoneId = Number(e.target.value);
    dispatch(setSelectedZone(newZoneId));
    router.push(`/zone/${newZoneId}`);
  };

  if (loading || !selectedZone)
    return (
      <div className="md:full bg-dozebg2 mx-auto px-4 sm:px-6 py-6 space-y-6">
        <ZoneHeaderSkeleton />
        <div className="block sm:hidden">
          <ZoneBannerSkeleton height={180} />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-6">
          <div className="w-full md:w-[65%] pr-1 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertiesCardSkeleton key={i} />
            ))}
          </div>
          <div className="hidden sm:block md:w-[35%] mt-2">
            <div className="sticky top-24">
              <ZoneBannerSkeleton height={620} />
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-lg text-red-600">
        {t('zone.errorNotFound')}
      </p>
    );

  const zoneCoordinates = parseAreaToCoordinates(selectedZone.area);
  const pointsCoordinates = extractPoints(selectedZone.properties);

  const coverImage = selectedZone.images?.[0] || '/logo.png';
  const heroBackground = coverImage;

  const heroDescription =
    selectedZone.description && selectedZone.description.length > 0
      ? selectedZone.description.length > 220
        ? `${selectedZone.description.slice(0, 217)}…`
        : selectedZone.description
      : String(t('zone.hero.descriptionFallback'));

  const propertiesList = selectedZone.properties || [];

  const propertyCount = propertiesList.length;

  const totalRoomTypes = propertiesList.reduce(
    (acc, property) => acc + (property.room_types?.length ?? 0),
    0
  );

  const uniqueServices = (() => {
    const serviceSet = new Set<string>();
    propertiesList.forEach((property) => {
      property.services?.forEach((service) => {
        if (service?.name) serviceSet.add(service.name);
      });
      property.room_types?.forEach((room) => {
        room.services?.forEach((service) => {
          if (service?.name) serviceSet.add(service.name);
        });
      });
    });
    return Array.from(serviceSet);
  })();

  const highlightServices = uniqueServices.slice(0, 4);

  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const statsItems = [
    {
      icon: Building2,
      value: propertyCount,
      label: String(t('zone.stats.properties')),
    },
    {
      icon: LayoutGrid,
      value: totalRoomTypes,
      label: String(t('zone.stats.rooms')),
    },
    {
      icon: Sparkles,
      value: uniqueServices.length,
      label: String(t('zone.stats.services')),
    },
  ];

  return (
    <div className="md:full bg-dozebg2 mx-auto px-4 sm:px-6 py-2">
      {/* Hero principal */}
      <div className="relative mt-6 mb-10 px-3 sm:px-4">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/40 sm:border-white/50 bg-dozebg1 shadow-2xl">
          <div className="absolute inset-0">
            <Image
              src={heroBackground}
              alt={`${String(t('zone.gallery.mainAltPrefix'))} ${selectedZone.name}`}
              fill
              className="object-cover opacity-60"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#101a43]/90 via-[#15265c]/75 to-[#213779]/70" />
          </div>
          <div className="relative grid gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12 text-white lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                  <Compass className="w-4 h-4 text-white/80" />
                  {t('zone.hero.badge')}
                </span>
                <div className="flex sm:hidden flex-col gap-2 text-white/70 text-xs">
                  <span>{t('zone.selector.subtitle')}</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/70" />
                    <span>{t('zone.selector.title')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight break-words">
                  {selectedZone.name}
                </h1>
                <p className="max-w-2xl text-sm sm:text-base text-white/80">
                  {heroDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {statsItems.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-md backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-white">
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-lg font-semibold">{value}</span>
                    </div>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-white/60">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {highlightServices.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    {t('zone.servicesLabel')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {highlightServices.map((service) => (
                      <span
                        key={service}
                        className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white"
                      >
                        <Sparkles className="w-3 h-3" />
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full sm:max-w-[360px] lg:w-full">
              <div className="flex h-full flex-col gap-5 rounded-3xl bg-white/95 dark:bg-[#09112a]/95 p-5 sm:p-6 shadow-xl dark:shadow-[0_20px_45px_rgba(2,8,23,0.6)] text-dozeblue dark:text-white border border-white/50 dark:border-white/10 transition-colors">
                <div className="hidden sm:flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-dozeblue dark:text-blue-200 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-dozeblue dark:text-white">
                      {t('zone.selector.title')}
                    </p>
                    <p className="mt-1 text-xs text-dozegray dark:text-white/60">
                      {t('zone.selector.subtitle')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.25em] text-dozegray dark:text-white/60">
                    {t('zone.headerLabel')}
                  </label>
                  <select
                    value={selectedZone.id}
                    onChange={handleZoneChange}
                    aria-label={String(t('zone.headerLabel'))}
                    className="w-full rounded-full border border-dozeblue/30 dark:border-white/15 bg-white dark:bg-[#0f172a] px-4 py-2 text-sm font-semibold text-dozeblue dark:text-white shadow-sm transition focus:border-dozeblue dark:focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-dozeblue/30 dark:focus:ring-blue-400/30"
                  >
                    {allZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('zone-map')}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-dozeblue px-4 py-2 text-sm font-semibold text-white transition hover:bg-dozeblue/90 focus:outline-none focus:ring-2 focus:ring-dozeblue/30 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-300/40"
                  >
                    {t('zone.actions.exploreMap')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="zone-map" className="h-0" aria-hidden="true" />

      {/* Mapa en mobile */}
      <div className="block sm:hidden mb-5 mt-3">
        <ZoneBanner
          zoneCoordinates={zoneCoordinates}
          pointsCoordinates={pointsCoordinates}
          className="rounded-3xl border border-white/30 bg-white/60 shadow-xl dark:border-white/10 dark:bg-[#050b1a]/80"
          mapClassName="h-[230px] min-[420px]:h-[260px] w-full rounded-[28px] overflow-hidden"
        />
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Propiedades */}
        <div className="w-full md:w-[65%] pr-1 space-y-4 scroll-smooth snap-y snap-mandatory md:h-[80vh] md:overflow-y-auto">
          {selectedZone.properties?.length > 0 ? (
            selectedZone.properties.map((property: Property) => (
              <div
                key={property.id}
                id={`property-${property.id}`}
                className="snap-start scroll-mt-24"
              >
                <PropertiesCard {...property} />
              </div>
            ))
          ) : (
            <p className="text-dozegray text-center">
              {t('zone.noProperties')}
            </p>
          )}
        </div>

        {/* Mapa fijo en desktop */}
        <div className="hidden sm:block md:w-[35%] mt-2" id="zone-map-desktop">
          <div className="sticky top-24 h-[620px] rounded-3xl overflow-hidden shadow-lg">
            <ZoneBanner
              zoneCoordinates={zoneCoordinates}
              pointsCoordinates={pointsCoordinates}
              className="rounded-3xl bg-white/70 dark:bg-[#050b1a]/85 dark:border-white/10"
              mapClassName="h-full w-full rounded-[32px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
