'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CalendarDays, Users, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { ReservationData } from '@/store/reserveSlice';
import { fetchAvailability } from '@/store/propertiesSlice';

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

  const grouped = useMemo(() => {
    const map = new Map<number, ReservationData[]>();
    reservations.forEach((res) => {
      if (!map.has(res.property_id)) {
        map.set(res.property_id, []);
      }
      map.get(res.property_id)!.push(res);
    });
    return Array.from(map.entries());
  }, [reservations]);

  const totalGeneral = useMemo(() => {
    return reservations.reduce((sum, r) => sum + r.total_price, 0);
  }, [reservations]);

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

  const handleSearchAnotherInProperty = (propertyId: number) => {
    router.push(`/properties/${propertyId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-dozeblue">
        Resumen de tu reserva
      </h2>

      {grouped.length === 0 && (
        <div className="text-center text-gray-500">No hay datos de reserva</div>
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
              {firstRes.property_name || `Propiedad ${propertyId}`}
            </div>

            {propertyReservations.map((res, index) => (
              <div
                key={index}
                className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white dark:bg-dozegray/5 border border-dozeblue/10 rounded-lg px-3 py-2"
              >
                <span className="flex items-center gap-1 text-sm text-[var(--foreground)]">
                  <MapPin className="w-4 h-4" /> {res.roomType}
                </span>

                <span className="flex items-center gap-1 text-sm">
                  <CalendarDays className="w-4 h-4" /> {res.check_in}
                </span>

                <span className="flex items-center gap-1 text-sm">
                  <CalendarDays className="w-4 h-4" /> {res.check_out}
                </span>

                <span className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4" /> {res.pax_count} huésped
                  {res.pax_count > 1 ? 'es' : ''}
                </span>

                <span className="font-bold text-dozeblue">
                  ${res.total_price}
                </span>

                <button
                  onClick={() => onDeleteReservation(reservations.indexOf(res))}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Eliminar reserva"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => handleSearchAnotherInProperty(propertyId)}
                className="text-sm border border-dozeblue text-dozeblue px-2 py-1 rounded hover:bg-dozeblue/10 transition"
              >
                Buscar otra habitación en esta propiedad
              </button>

              <span className="text-sm font-bold text-dozeblue">
                Total propiedad {propertyId}: ${totalProperty}
              </span>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end text-dozeblue font-bold text-sm">
        Total general: ${totalGeneral}
      </div>

      <div className="flex flex-wrap justify-between gap-2 mt-4">
        <button
          onClick={handleAddReservation}
          className="text-dozeblue border border-dozeblue px-4 py-2 rounded-lg text-sm font-medium hover:bg-dozeblue/10 transition-colors"
        >
          Volver / Agregar otra reservación
        </button>

        <button
          onClick={onNext}
          className="px-6 py-3 rounded-lg text-sm font-semibold bg-dozeblue text-white hover:bg-dozeblue/90 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
