'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { MapPin, CalendarDays, User } from 'lucide-react';
import { DateRange, RangeKeyDict, Range } from 'react-date-range';
import { addDays, format } from 'date-fns';
import { fetchAvailability } from '@/store/propertiesSlice';
import AvailabilityResult from '@/components/ui/AvailabilityResult';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function PropertyDetailPage() {
  const property = useSelector(
    (state: RootState) => state.properties.selectedProperty
  );
  const dispatch = useDispatch<AppDispatch>();
  const {
    availability,
    loading,
    error: reduxError,
  } = useSelector((state: RootState) => state.properties);

  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
    },
  ]);
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Cierre del calendario al click externo
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const selected = range[0];
    if (!selected.startDate || !selected.endDate) {
      setError('Por favor seleccioná una fecha válida');
      return;
    }

    if (!property?.id) {
      setError('Propiedad no disponible');
      return;
    }

    const formatted = {
      check_in: selected.startDate.toISOString().split('T')[0],
      check_out: selected.endDate.toISOString().split('T')[0],
      guests,
      property_id: property.id,
    };
    console.log('data formateada ', formatted);
    setError(null);
    dispatch(fetchAvailability(formatted));
  };

  if (!property)
    return <p className="text-center py-10">Cargando propiedad...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">
        {property.name}
      </h1>
      <p className="text-sm text-gray-600 flex items-center gap-1 mb-6">
        <MapPin className="w-4 h-4" />
        {property.address || 'Dirección no disponible'}
      </p>

      {/* BUSCADOR */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
          <div className="relative w-full md:w-auto" ref={calendarRef}>
            <div
              onClick={() => setShowCalendar((prev) => !prev)}
              className="flex items-center gap-3 border border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10 px-4 py-3 rounded-md shadow-sm cursor-pointer hover:ring-2 ring-dozeblue transition w-full md:w-[250px]"
            >
              <CalendarDays className="text-dozeblue" size={18} />
              <span className="text-[var(--foreground)] text-sm font-medium truncate">
                {format(range[0].startDate!, 'dd MMM')} —{' '}
                {format(range[0].endDate!, 'dd MMM')}
              </span>
            </div>

            {showCalendar && (
              <div className="absolute z-50 mt-2 shadow-xl rounded-xl overflow-hidden border dark:border-white/20 bg-white dark:bg-dozebg1">
                <DateRange
                  ranges={range}
                  onChange={(item: RangeKeyDict) => {
                    const selection = item.selection;
                    if (selection) setRange([selection]);
                  }}
                  moveRangeOnFirstSelection={false}
                  rangeColors={['#2463eb']}
                  minDate={new Date()}
                  showDateDisplay={false}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10 px-4 h-12 rounded-md shadow-sm w-full md:w-[220px]">
            <User className="text-dozeblue" size={20} />
            <span className="text-sm text-[var(--foreground)] font-light">
              Huésp.
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 dark:border-white/30 text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-dozegray/30"
              >
                −
              </button>
              <span className="w-5 text-center text-[var(--foreground)] text-sm">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests(guests + 1)}
                className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 dark:border-white/30 hover:bg-gray-100 dark:hover:bg-dozegray/30"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-greenlight py-3 px-6 rounded-md hover:bg-dozeblue/90 text-dozeblue hover:text-white transition font-semibold w-full md:w-auto"
          >
            Consultar
          </button>
        </div>
      </form>

      {/* Errores y estado */}
      {error && <p className="text-red-500">{error}</p>}
      {reduxError && <p className="text-red-500">{reduxError}</p>}
      {loading && (
        <p className="text-center text-dozegray">Cargando disponibilidad...</p>
      )}
      {!!availability.length && <AvailabilityResult guests={guests} />}
    </div>
  );
}
