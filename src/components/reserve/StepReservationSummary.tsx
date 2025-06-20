'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { selectReservationData } from '@/store/selectors/reserveSelectors';
import { selectSelectedProperty } from '@/store/selectors/propertiesSelectors';
import { getPropertyById } from '@/store/propertiesSlice';
import type { AppDispatch } from '@/store';

interface Props {
  onNext: () => void;
}

export default function StepReservationSummary({ onNext }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectReservationData);
  const property = useSelector(selectSelectedProperty);

  useEffect(() => {
    if (data?.property_id && !property) {
      dispatch(getPropertyById(data.property_id));
    }
  }, [data?.property_id, property, dispatch]);

  if (!data)
    return (
      <div className="text-center text-gray-500">No hay datos de reserva</div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dozeblue">
        Resumen de tu reserva
      </h2>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dozegray/5 shadow-sm p-4 sm:p-6 space-y-3">
        {property && (
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dozegray/5 shadow-sm p-4 sm:p-6">
            <div className="text-sm text-[var(--foreground)] space-y-1 mb-4">
              <p className="text-lg font-semibold text-dozeblue">
                {property.name}
              </p>
              <p>{property.address}</p>
            </div>
          </div>
        )}{' '}
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm text-[var(--foreground)]">
          <MapPin className="w-5 h-5 text-dozeblue mt-[2px]" />
          <div>
            <p className="font-medium leading-tight">Tipo de habitación</p>
            <p className="text-sm">{data.roomType}</p>
          </div>

          <CalendarDays className="w-5 h-5 text-dozeblue mt-[2px]" />
          <div>
            <p className="font-medium leading-tight">Check-in</p>
            <p className="text-sm">{data.check_in}</p>
          </div>

          <CalendarDays className="w-5 h-5 text-dozeblue mt-[2px]" />
          <div>
            <p className="font-medium leading-tight">Check-out</p>
            <p className="text-sm">{data.check_out}</p>
          </div>

          <Users className="w-5 h-5 text-dozeblue mt-[2px]" />
          <div>
            <p className="font-medium leading-tight">Huéspedes</p>
            <p className="text-sm">{data.pax_count}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-white/10 text-sm font-semibold text-dozeblue flex justify-between items-center">
          <span>Total a pagar:</span>
          <span className="text-base">${data.total_price}</span>
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={onNext}
          className="bg-dozeblue text-white px-6 py-3 rounded-lg hover:bg-dozeblue/90 transition-colors font-semibold text-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
