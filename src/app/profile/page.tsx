'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { selectCustomerProfile } from '@/store/selectors/customerSelectors';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { getMyReservations } from '@/services/reservationApi';
import type { ReservationData } from '@/store/reserveSlice';

export default function ProfilePage() {
  const profile = useSelector((state: RootState) =>
    selectCustomerProfile(state)
  );

  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const data = await getMyReservations();
        setReservations(data ?? []);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReservations();
  }, []);

  const totalSpent = useMemo(() => {
    return reservations.reduce((sum, r) => sum + (r.total_price ?? 0), 0);
  }, [reservations]);

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-dozeblue mb-4">
          Sesión no iniciada
        </h2>
        <p className="text-gray-600 mb-6">
          Por favor inicia sesión para ver tu perfil.
        </p>
        <Link
          href="/login?redirect=/profile"
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition"
        >
          Ir al login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-dozeblue mb-6">Mi perfil</h1>

      {/* Datos del usuario */}
      <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-dozegray dark:text-white/80">
            Email
          </label>
          <p className="text-lg font-semibold text-dozeblue mt-1">
            {profile.email}
          </p>
        </div>

        {/* Gasto total */}
        <div className="pt-2 border-t border-gray-100 dark:border-white/10">
          <label className="block text-sm font-medium text-dozegray dark:text-white/80">
            Gasto total en Dozzze
          </label>
          <p className="text-lg font-semibold text-dozeblue mt-1">
            € {totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Listado de reservas */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-dozeblue mb-4">
          Mis reservas
        </h2>

        {isLoading ? (
          <p className="text-dozegray dark:text-white/70">
            Cargando reservas...
          </p>
        ) : reservations.length === 0 ? (
          <p className="text-dozegray dark:text-white/70">
            Aún no tienes reservas.
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-3 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]">
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <ul className="space-y-4">
              {reservations.map((r, index) => (
                <li
                  key={`${r.check_in}-${index}`}
                  className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-lg p-4 shadow-xs hover:shadow-md transition-shadow duration-200"
                >
                  {/* Encabezado */}
                  <div className="mb-2">
                    <p className="text-dozeblue font-semibold text-lg">
                      {r.property_name}
                    </p>
                    <p className="text-sm text-dozegray dark:text-white/70">
                      {new Date(r.check_in).toLocaleDateString()} –{' '}
                      {new Date(r.check_out).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Detalle de habitaciones */}
                  <ul className="space-y-1 mt-2">
                    {r.room_reservations.map((rr, i) => (
                      <li
                        key={i}
                        className="text-sm text-dozegray dark:text-white/80 flex justify-between"
                      >
                        <span>
                          {rr.room_type} ({rr.guests} huésped
                          {rr.guests !== 1 ? 'es' : ''})
                        </span>
                        <span className="font-semibold text-dozeblue">
                          € {rr.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Total */}
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/10 flex justify-between font-semibold text-dozeblue">
                    <span>Total:</span>
                    <span>€ {r.total_price.toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
