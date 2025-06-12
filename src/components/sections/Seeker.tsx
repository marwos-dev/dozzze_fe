'use client';

import { useState, useRef, useEffect } from 'react';
import { DateRange, RangeKeyDict, Range } from 'react-date-range';
import { addDays, format } from 'date-fns';
import { CalendarDays, User } from 'lucide-react';
import AnimatedButton from '../ui/buttons/AnimatedButton';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function Seeker() {
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
  const [showGuestBox, setShowGuestBox] = useState(false);

  const calendarRef = useRef<HTMLDivElement | null>(null);
  const guestRef = useRef<HTMLDivElement | null>(null);

  // Cierre automático de popups
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setShowGuestBox(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selected = range[0];
    if (!selected.startDate || !selected.endDate) {
      setError('Por favor seleccioná una fecha válida');
      return;
    }

    const formatted = {
      check_in: selected.startDate.toISOString().split('T')[0],
      check_out: selected.endDate.toISOString().split('T')[0],
      guests,
    };

    setError(null);
    console.log(formatted);
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-dozebg1 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Línea superior con filtros */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:gap-6">
          {/* Selector de fechas */}
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

          {/* Selector de huéspedes */}
          <div className="relative w-full md:w-auto" ref={guestRef}>
            <div className="flex items-center gap-3 border border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10 px-4 h-12 rounded-md shadow-sm w-full md:w-[220px]">
              <>
                <User className="text-dozeblue" size={20} />
                <span className="text-sm text-[var(--foreground)] font-light">
                  Huésp.
                </span>
              </>

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
          </div>

          {/* Botón consultar */}
          <button
            type="submit"
            className="bg-greenlight  py-3 px-6 rounded-md hover:bg-dozeblue/90 text-dozeblue hover:text-white transition font-semibold w-full md:w-auto"
          >
            Consultar
          </button>
        </div>
      </form>

      {/* Botones secundarios */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <button
          onClick={() =>
            window.open(
              '/fns-booking-frame',
              '_blank',
              'width=600,height=700,scrollbars=yes,resizable=yes'
            )
          }
          className="min-w-[220px] text-dozeblue border border-dozeblue px-4 py-2 rounded-full hover:bg-dozeblue hover:text-white transition font-medium text-center"
        >
          Expandí tu búsqueda
        </button>

        <AnimatedButton
          text="Conocé Nuestras Zonas"
          sectionId="#zones"
          className="min-w-[220px]"
        />
      </div>
    </div>
  );
}
