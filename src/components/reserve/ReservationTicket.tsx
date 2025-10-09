'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CalendarDays, MapPin, Users, FileText } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function ReservationTicket() {
  const reservations = useSelector((state: RootState) => state.reserve.data);
  const discount = useSelector((state: RootState) => state.reserve.discount);
  const { t } = useLanguage();

  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        {t('reserve.ticket.empty')}
      </div>
    );
  }

  const guest = reservations[0];
  let totalGeneral = reservations.reduce((acc, r) => acc + r.total_price, 0);
  if (discount) {
    if (discount.type === 'coupon' && discount.discount_percent) {
      totalGeneral = totalGeneral * (1 - discount.discount_percent / 100);
    } else if (discount.type === 'voucher' && discount.remaining_amount) {
      totalGeneral = Math.max(totalGeneral - discount.remaining_amount, 0);
    }
  }
  return (
    <div className="bg-white dark:bg-dozegray/5 border border-dozeblue/10 dark:border-white/10 rounded-2xl shadow-md max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-dozeblue text-center">
        {t('reserve.ticket.title')}
      </h2>

      {/* Datos del huésped */}
      <div className="text-sm text-[var(--foreground)] space-y-1">
        <h3 className="font-semibold text-dozeblue mb-2">
          {t('reserve.ticket.guestDataTitle')}
        </h3>
        <p>
          <strong>{t('reserve.ticket.name')}:</strong> {guest.guest_name}
        </p>
        <p>
          <strong>{t('reserve.ticket.email')}:</strong> {guest.guest_email}
        </p>
        <p>
          <strong>{t('reserve.ticket.phone')}:</strong> {guest.guest_phone}
        </p>
        <p>
          <strong>{t('reserve.ticket.address')}:</strong> {guest.guest_address}
        </p>
        <p>
          <strong>{t('reserve.ticket.city')}:</strong> {guest.guest_city}
        </p>
        <p>
          <strong>{t('reserve.ticket.postalCode')}:</strong> {guest.guest_cp}
        </p>
        <p>
          <strong>{t('reserve.ticket.country')}:</strong> {guest.guest_country}
        </p>
        {guest.guest_remarks && (
          <p>
            <strong>{t('reserve.ticket.comments')}:</strong>{' '}
            {guest.guest_remarks}
          </p>
        )}
      </div>

      {/* Lista de reservas */}
      <div className="space-y-4">
        <h3 className="font-semibold text-dozeblue mb-2">
          {t('reserve.ticket.reservationsTitle')}
        </h3>
        {reservations.map((res, index) => (
          <div
            key={index}
            className="border border-dozeblue/10 dark:border-white/10 bg-white dark:bg-dozegray/10 rounded-lg px-4 py-3 space-y-1"
          >
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" /> {res.roomType}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4" /> {t('reserve.ticket.checkIn')}:{' '}
              {res.check_in}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4" /> {t('reserve.ticket.checkOut')}:{' '}
              {res.check_out}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" /> {res.pax_count}{' '}
              {res.pax_count === 1
                ? t('reserve.guests.singular')
                : t('reserve.guests.plural')}
            </p>
            <p className="font-semibold text-dozeblue text-sm">
              {t('reserve.ticket.total')}: ${res.total_price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Total general */}
      <div className="text-right text-dozeblue font-bold text-sm">
        {t('reserve.ticket.grandTotal')}: ${totalGeneral.toFixed(2)}
      </div>

      {/* Términos y condiciones */}
      {guest.terms_and_conditions && (
        <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-dozeblue font-semibold text-base">
            <FileText className="w-5 h-5" />
            {t('reserve.terms.title')}
          </div>
          <div className="space-y-4 text-sm text-[var(--foreground)] leading-relaxed">
            <div>
              <div className="font-semibold mb-1">
                {t('reserve.terms.confirmation')}
              </div>
              <div>{guest.terms_and_conditions.condition_of_confirmation}</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="w-full sm:w-1/2">
                <div className="font-semibold mb-1">
                  {t('reserve.terms.checkIn')}
                </div>
                <div className="bg-green-100 text-dozeblue dark:bg-green-600/20 px-4 py-2 rounded-md border border-green-300 dark:border-green-600">
                  {guest.terms_and_conditions.check_in_time}
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <div className="font-semibold mb-1">
                  {t('reserve.terms.checkOut')}
                </div>
                <div className="bg-red-100 text-dozeblue dark:bg-red-600/20 px-4 py-2 rounded-md border border-red-300 dark:border-red-600">
                  {guest.terms_and_conditions.check_out_time}
                </div>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-1">
                {t('reserve.terms.cancellation')}
              </div>
              <div>{guest.terms_and_conditions.cancellation_policy}</div>
            </div>

            <div>
              <div className="font-semibold mb-1">
                {t('reserve.terms.additional')}
              </div>
              <div>{guest.terms_and_conditions.additional_information}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
