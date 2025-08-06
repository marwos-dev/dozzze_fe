'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CalendarDays, MapPin, Users, FileText } from 'lucide-react';

export default function ReservationTicket() {
  const reservations = useSelector((state: RootState) => state.reserve.data);
  const discount = useSelector((state: RootState) => state.reserve.discount);

  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No hay reservas para mostrar.
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
        Ticket de Reserva
      </h2>

      {/* Datos del huésped */}
      <div className="text-sm text-[var(--foreground)] space-y-1">
        <h3 className="font-semibold text-dozeblue mb-2">Datos del huésped</h3>
        <p>
          <strong>Nombre:</strong> {guest.guest_name}
        </p>
        <p>
          <strong>Email:</strong> {guest.guest_email}
        </p>
        <p>
          <strong>Teléfono:</strong> {guest.guest_phone}
        </p>
        <p>
          <strong>Dirección:</strong> {guest.guest_address}
        </p>
        <p>
          <strong>Ciudad:</strong> {guest.guest_city}
        </p>
        <p>
          <strong>Código Postal:</strong> {guest.guest_cp}
        </p>
        <p>
          <strong>País:</strong> {guest.guest_country}
        </p>
        {guest.guest_remarks && (
          <p>
            <strong>Comentarios:</strong> {guest.guest_remarks}
          </p>
        )}
      </div>

      {/* Lista de reservas */}
      <div className="space-y-4">
        <h3 className="font-semibold text-dozeblue mb-2">
          Reservas realizadas
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
              <CalendarDays className="w-4 h-4" /> Check-in: {res.check_in}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4" /> Check-out: {res.check_out}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" /> {res.pax_count} huésped
              {res.pax_count > 1 ? 'es' : ''}
            </p>
            <p className="font-semibold text-dozeblue text-sm">
              Total: ${res.total_price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Total general */}
      <div className="text-right text-dozeblue font-bold text-sm">
        Total general pagado: ${totalGeneral.toFixed(2)}
      </div>

      {/* Términos y condiciones */}
      {guest.terms_and_conditions && (
        <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-dozeblue font-semibold text-base">
            <FileText className="w-5 h-5" />
            Términos y condiciones
          </div>
          <div className="space-y-4 text-sm text-[var(--foreground)] leading-relaxed">
            <div>
              <div className="font-semibold mb-1">
                Condición de confirmación
              </div>
              <div>{guest.terms_and_conditions.condition_of_confirmation}</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="w-full sm:w-1/2">
                <div className="font-semibold mb-1">Check-in</div>
                <div className="bg-green-100 text-dozeblue dark:bg-green-600/20 px-4 py-2 rounded-md border border-green-300 dark:border-green-600">
                  {guest.terms_and_conditions.check_in_time}
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <div className="font-semibold mb-1">Check-out</div>
                <div className="bg-red-100 text-dozeblue dark:bg-red-600/20 px-4 py-2 rounded-md border border-red-300 dark:border-red-600">
                  {guest.terms_and_conditions.check_out_time}
                </div>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-1">Política de cancelación</div>
              <div>{guest.terms_and_conditions.cancellation_policy}</div>
            </div>

            <div>
              <div className="font-semibold mb-1">Información adicional</div>
              <div>{guest.terms_and_conditions.additional_information}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
