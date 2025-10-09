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
  const { t } = useLanguage();

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-dozeblue">
        {t('reserve.summary.title')}
      </h2>

      {grouped.length === 0 && (
        <div className="text-center text-gray-500">
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
            className="space-y-2 border border-dozeblue/10 rounded-xl p-4 bg-dozeblue/5 dark:bg-dozeblue/10"
          >
            <div className="font-bold text-dozeblue mb-2">
              {firstRes.property_name ||
                `${String(t('reserve.summary.propertyFallback'))} ${propertyId}`}
            </div>

            {propertyReservations.map((res, index) => {
              const images = res.images ?? [];

              return (
                <div
                  key={index}
                  className="relative flex flex-col md:flex-row gap-4 bg-white dark:bg-dozegray/5 border border-dozeblue/10 rounded-lg p-4"
                >
                  {/* Botón eliminar en esquina superior derecha */}
                  <button
                    onClick={() =>
                      onDeleteReservation(reservations.indexOf(res))
                    }
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Bloque galería */}
                  <div className="md:w-60 flex flex-col gap-2 shrink-0">
                    <div
                      className="relative w-full h-36 rounded-md overflow-hidden border border-gray-300 cursor-pointer"
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
                        className="object-cover"
                      />
                    </div>
                    <div className="hidden md:flex gap-2 overflow-x-auto max-w-full">
                      {images.slice(1, 6).map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-14 h-14 rounded-md overflow-hidden border border-gray-300 cursor-pointer"
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
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {images.length > 6 && (
                        <div
                          className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-md bg-gray-100 text-sm text-gray-600 cursor-pointer"
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

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-base font-semibold mb-2 text-[var(--foreground)]">
                        {res.roomType}
                      </div>
                      <div className="text-sm flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4 text-dozeblue" />
                          <span className="text-dozeblue">
                            {res.check_in} → {res.check_out}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-dozeblue" />
                          <span className="text-dozeblue">
                            {res.pax_count}{' '}
                            {res.pax_count === 1
                              ? t('reserve.guests.singular')
                              : t('reserve.guests.plural')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 self-end text-dozeblue font-bold text-lg sm:text-xl text-right">
                      ${res.total_price.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() =>
                  handleSearchAnotherInProperty(propertyId, firstRes.property_name)
                }
                className="text-sm border pt-2 border-dozeblue text-dozeblue px-2 py-1 rounded hover:bg-dozeblue/10 transition"
              >
                {t('reserve.summary.searchAnotherRoom')}
              </button>
              <span className="text-sm font-bold pl-3 text-dozeblue">
                {t('reserve.summary.propertyTotalPrefix')} {propertyId}:{' '}
                ${totalProperty.toFixed(2)}
              </span>
            </div>

            {firstRes.terms_and_conditions && (
              <div className="bg-white dark:bg-dozegray/5 border border-gray-200 dark:border-white/10 rounded-lg p-4 mt-2 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-dozeblue font-semibold text-base">
                  <FileText className="w-5 h-5" />
                  {t('reserve.terms.propertyTitle')}
                </div>
                <div className="space-y-4 text-sm text-[var(--foreground)] leading-relaxed">
                  <div>
                    <div className="font-semibold mb-1">
                      {t('reserve.terms.confirmation')}
                    </div>
                    <div>
                      {firstRes.terms_and_conditions.condition_of_confirmation}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="w-full sm:w-1/2">
                      <div className="font-semibold mb-1 text-[var(--foreground)]">
                        {t('reserve.terms.checkIn')}
                      </div>
                      <div className="flex items-center gap-2 bg-green-100 text-dozeblue dark:bg-green-600/20 px-4 py-2 rounded-md border border-green-300 dark:border-green-600">
                        <span className="text-lg font-semibold">
                          {firstRes.terms_and_conditions.check_in_time}
                        </span>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <div className="font-semibold mb-1 text-[var(--foreground)]">
                        {t('reserve.terms.checkOut')}
                      </div>
                      <div className="flex items-center gap-2 bg-red-100 text-dozeblue dark:bg-red-600/20 px-4 py-2 rounded-md border border-red-300 dark:border-red-600">
                        <span className="text-lg font-semibold">
                          {firstRes.terms_and_conditions.check_out_time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      {t('reserve.terms.cancellation')}
                    </div>
                    <div>
                      {firstRes.terms_and_conditions.cancellation_policy}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      {t('reserve.terms.additional')}
                    </div>
                    <div>
                      {firstRes.terms_and_conditions.additional_information}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-end text-dozeblue font-bold text-sm">
        {t('reserve.summary.grandTotal')}: ${totalGeneral.toFixed(2)}
      </div>

      <div className="flex flex-wrap justify-between gap-2 mt-4">
        <button
          onClick={handleAddReservation}
          className="text-dozeblue border border-dozeblue px-4 py-2 rounded-lg text-sm font-medium hover:bg-dozeblue/10 transition-colors"
        >
          {t('reserve.buttons.goBackAdd')}
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-lg text-sm font-semibold bg-dozeblue text-white hover:bg-dozeblue/90 transition-colors"
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
