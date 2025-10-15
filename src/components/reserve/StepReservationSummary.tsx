'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import slugify from '@/utils/slugify';
import { CalendarDays, Users, X, FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { ReservationData } from '@/store/reserveSlice';
import { fetchAvailability } from '@/store/propertiesSlice';
import Image from 'next/image';
import ImageGalleryModal from '@/components/ui/modals/ImageGaleryModal';
import { useLanguage } from '@/i18n/LanguageContext';

const fallbackThumbnail = '/logo.png';

interface Props {
  reservations: ReservationData[];
  onAddReservation: () => void;
  onDeleteReservation: (index: number) => void;
  onNext: () => void;
}

export default function StepReservationSummary({
  reservations,
  onAddReservation,
  onDeleteReservation,
  onNext,
}: Props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const discount = useSelector((state: RootState) => state.reserve.discount);
  const { t, lang } = useLanguage();

  const [openGallery, setOpenGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const grouped = useMemo(() => {
    const map = new Map<number, ReservationData[]>();
    reservations.forEach((res) => {
      if (!map.has(res.property_id)) map.set(res.property_id, []);
      map.get(res.property_id)!.push(res);
    });
    return Array.from(map.entries());
  }, [reservations]);

  const totalGeneral = useMemo(() => {
    let total = reservations.reduce((sum, r) => sum + r.total_price, 0);
    if (discount) {
      if (discount.type === 'coupon' && discount.discount_percent) {
        total = total * (1 - discount.discount_percent / 100);
      } else if (discount.type === 'voucher' && discount.remaining_amount) {
        total = Math.max(total - discount.remaining_amount, 0);
      }
    }
    return total;
  }, [reservations, discount]);

  const handleAddReservation = async () => {
    if (reservations.length === 0) {
      onAddReservation();
      return;
    }

    const lastRes = reservations[reservations.length - 1];
    const payload = {
      check_in: lastRes.check_in,
      check_out: lastRes.check_out,
      guests: lastRes.pax_count,
    };

    await dispatch(fetchAvailability(payload));
    router.push(`/`);
  };

  const handleSearchAnotherInProperty = (
    propertyId: number,
    propertyName?: string
  ) => {
    const slug = propertyName ? slugify(propertyName) : String(propertyId);
    router.push(`/properties/${slug}`);
  };

  return (
    <div className="space-y-8 text-dozeblue ">
      <h2 className="text-3xl font-semibold text-dozeblue">
        {t('reserve.summary.title')}
      </h2>

      {grouped.length === 0 && (
        <div className="rounded-3xl border border-white/50 bg-white/90 p-12 text-center text-dozeblue/70 shadow-[0_18px_45px_rgba(30,64,175,0.08)] backdrop-blur dark:border-white/10 dark:bg-dozebg1 dark:text-slate-300 dark:shadow-[0_22px_55px_rgba(2,31,89,0.45)]">
          {t('reserve.summary.empty')}
        </div>
      )}

      {grouped.map(([propertyId, propertyReservations]) => {
        const totalProperty = propertyReservations.reduce(
          (sum, r) => sum + r.total_price,
          0
        );
        const firstRes = propertyReservations[0];

        return (
          <div
            key={propertyId}
            className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white p-8 shadow-[0_18px_32px_rgba(30,64,175,0.1)] backdrop-blur dark:border-white/10 dark:bg-dozebg1 dark:shadow-[0_30px_55px_rgba(2,31,89,0.32)]"
          >
            <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(64,93,230,0.18),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.15),transparent_75%)]" />
            <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(2,31,89,0.15),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_75%)]" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-lg font-semibold text-dozeblue/70 ">
                  {firstRes.property_name ||
                    `${String(t('reserve.summary.propertyFallback'))} ${propertyId}`}
                </span>
                <button
                  onClick={() =>
                    handleSearchAnotherInProperty(
                      propertyId,
                      firstRes.property_name
                    )
                  }
                  className="inline-flex items-center justify-center rounded-full border border-dozeblue/40 bg-white px-4 py-2 text-xs font-medium text-dozeblue shadow-[0_12px_22px_rgba(30,64,175,0.12)] transition hover:-translate-y-0.5 hover:bg-white dark:border-dozeblue/40 dark:bg-transparent  dark:shadow-[0_18px_35px_rgba(14,116,244,0.25)] dark:hover:bg-dozeblue/10"
                >
                  {t('reserve.summary.searchAnotherRoom')}
                </button>
              </div>

              <div className="space-y-4">
                {propertyReservations.map((res, index) => {
                  const images = res.images ?? [];

                  return (
                    <div
                      key={index}
                      className="relative grid gap-6 rounded-3xl border border-white/60 bg-white p-5 shadow-[0_12px_22px_rgba(30,64,175,0.12)] md:grid-cols-[minmax(0,220px)_1fr] lg:grid-cols-[minmax(0,220px)_1fr_auto] dark:border-white/10 dark:bg-dozebg2 dark:shadow-[0_24px_42px_rgba(5,16,45,0.3)]"
                    >
                      <button
                        onClick={() =>
                          onDeleteReservation(reservations.indexOf(res))
                        }
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-[0_8px_18px_rgba(248,113,113,0.35)] transition hover:-translate-y-0.5 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-100 dark:shadow-[0_10px_20px_rgba(239,68,68,0.35)] dark:hover:bg-red-500/30"
                        aria-label={
                          lang === 'es'
                            ? 'Eliminar reservación'
                            : 'Remove reservation'
                        }
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="flex flex-col gap-3">
                        <div
                          className="group relative h-40 w-full cursor-pointer overflow-hidden rounded-2xl border border-white/60 bg-slate-100 dark:border-white/10 dark:bg-dozebg1"
                          onClick={() => {
                            setGalleryImages(images);
                            setGalleryIndex(0);
                            setOpenGallery(true);
                          }}
                        >
                          <Image
                            src={images[0] || fallbackThumbnail}
                            alt={`${String(t('reserve.summary.roomImageAlt'))} ${res.roomType}`}
                            fill
                            sizes="(min-width: 768px) 220px, 100vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="hidden gap-2 overflow-x-auto md:flex">
                          {images.slice(1, 6).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative h-14 w-14 cursor-pointer overflow-hidden rounded-xl border border-white/60 bg-slate-100 dark:border-white/10 dark:bg-dozebg1"
                              onClick={() => {
                                setGalleryImages(images);
                                setGalleryIndex(idx + 1);
                                setOpenGallery(true);
                              }}
                            >
                              <Image
                                src={img}
                                alt={`${String(t('reserve.summary.thumbnailAlt'))} ${idx + 1}`}
                                fill
                                sizes="56px"
                                className="object-cover transition duration-300 hover:scale-105"
                              />
                            </div>
                          ))}
                          {images.length > 6 && (
                            <div
                              className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-dozeblue/40 bg-dozeblue/5 text-xs font-semibold text-dozeblue dark:border-dozeblue/40 dark:bg-dozeblue/15"
                              onClick={() => {
                                setGalleryImages(images);
                                setGalleryIndex(5);
                                setOpenGallery(true);
                              }}
                            >
                              +{images.length - 6}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                          <span className="text-lg font-semibold text-dozeblue ">
                            {res.roomType}
                          </span>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-dozeblue dark:text-dozeblue">
                            <div className="flex items-center gap-2 rounded-full bg-dozeblue/10 px-3 py-1.5 dark:bg-dozeblue/20">
                              <CalendarDays className="h-4 w-4" />
                              <span className="font-medium">
                                {res.check_in} → {res.check_out}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-dozeblue/10 px-3 py-1.5 dark:bg-dozeblue/20">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">
                                {res.pax_count}{' '}
                                {res.pax_count === 1
                                  ? t('reserve.guests.singular')
                                  : t('reserve.guests.plural')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="hidden h-full items-center justify-end lg:flex">
                          <span className="rounded-full bg-white px-5 py-2 text-lg font-bold text-dozeblue shadow-[0_12px_24px_rgba(30,64,175,0.12)] dark:bg-dozebg2  dark:shadow-[0_18px_40px_rgba(2,31,89,0.4)]">
                            ${res.total_price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end lg:hidden">
                        <span className="rounded-full bg-white px-5 py-2 text-lg font-bold text-dozeblue shadow-[0_12px_24px_rgba(30,64,175,0.12)] dark:bg-dozebg2  dark:shadow-[0_18px_40px_rgba(2,31,89,0.35)]">
                          ${res.total_price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-dozeblue shadow-[0_12px_26px_rgba(30,64,175,0.12)] dark:bg-dozebg2  dark:shadow-[0_18px_36px_rgba(2,31,89,0.35)]">
                  {t('reserve.summary.propertyTotalPrefix')} {propertyId}:{' '}
                  <span className="text-base">${totalProperty.toFixed(2)}</span>
                </span>
              </div>

              {firstRes.terms_and_conditions && (
                <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_45px_rgba(64,93,230,0.08)] dark:border-white/10 dark:bg-dozebg1 dark:shadow-[0_24px_55px_rgba(2,31,89,0.4)]">
                  <div className="mb-4 flex items-center gap-2 text-dozeblue">
                    <FileText className="h-5 w-5" />
                    <span className="text-base font-semibold">
                      {t('reserve.terms.propertyTitle')}
                    </span>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <div>
                        <p className="font-semibold text-dozeblue dark:text-dozeblue">
                          {t('reserve.terms.confirmation')}
                        </p>
                        <p>
                          {
                            firstRes.terms_and_conditions
                              .condition_of_confirmation
                          }
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-dozeblue dark:text-dozeblue">
                          {t('reserve.terms.cancellation')}
                        </p>
                        <p>
                          {firstRes.terms_and_conditions.cancellation_policy}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <div>
                        <p className="font-semibold text-dozeblue dark:text-dozeblue">
                          {t('reserve.terms.checkIn')}
                        </p>
                        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-base font-semibold text-dozeblue dark:border-green-400/30 dark:bg-green-500/10 dark:text-green-200">
                          {firstRes.terms_and_conditions.check_in_time}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-dozeblue dark:text-dozeblue">
                          {t('reserve.terms.checkOut')}
                        </p>
                        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-base font-semibold text-dozeblue dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
                          {firstRes.terms_and_conditions.check_out_time}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-dozeblue dark:text-dozeblue">
                          {t('reserve.terms.additional')}
                        </p>
                        <p>
                          {firstRes.terms_and_conditions.additional_information}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end">
        <div className="rounded-full border border-white/60 bg-white/95 px-6 py-3 text-sm font-semibold text-dozeblue shadow-[0_12px_30px_rgba(30,64,175,0.12)] dark:border-white/15 dark:bg-dozebg2  dark:shadow-[0_20px_45px_rgba(2,31,89,0.35)]">
          {t('reserve.summary.grandTotal')}: ${totalGeneral.toFixed(2)}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4">
        <button
          onClick={handleAddReservation}
          className="inline-flex items-center justify-center rounded-full border border-dozeblue/40 bg-white/80 px-6 py-3 text-sm font-semibold text-dozeblue shadow-[0_16px_32px_rgba(30,64,175,0.12)] transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/10  dark:shadow-[0_18px_40px_rgba(2,31,89,0.45)] dark:hover:bg-white/15"
        >
          {t('reserve.buttons.goBackAdd')}
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center rounded-full bg-dozeblue px-8 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(2,31,89,0.35)] transition hover:-translate-y-0.5 hover:bg-dozeblue/90 dark:shadow-[0_28px_48px_rgba(14,116,244,0.4)]"
        >
          {t('reserve.buttons.continue')}
        </button>
      </div>

      {openGallery && (
        <ImageGalleryModal
          images={galleryImages}
          initialIndex={galleryIndex}
          onClose={() => setOpenGallery(false)}
        />
      )}
    </div>
  );
}
