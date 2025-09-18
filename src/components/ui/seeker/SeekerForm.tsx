'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { DateRange, RangeKeyDict, Range } from 'react-date-range';
import { addDays, format } from 'date-fns';
import { CalendarDays, User, Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchAvailability } from '@/store/propertiesSlice';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useLanguage } from '@/i18n/LanguageContext';
import AnimatedButton from '@/components/ui/buttons/AnimatedButton';

type Props = {
  className?: string;
  bare?: boolean;
  showActions?: boolean;
  dense?: boolean; // compacto
  tight?: boolean; // extra-compacto
  afterSearch?: (p: {
    check_in: string;
    check_out: string;
    guests: number;
  }) => void;
};

export default function SeekerForm({
  className = '',
  bare = false,
  showActions = false,
  dense = false,
  tight = false,
  afterSearch,
}: Props) {
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
    },
  ]);
  const [guests, setGuests] = useState(2);
  const [showCalendar, setShowCalendar] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const calendarRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      )
        setShowCalendar(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const sel = range[0];
      if (!sel.startDate || !sel.endDate) {
        const msg = t('seeker.invalidDate');
        setLocalError(Array.isArray(msg) ? msg.join(' ') : (msg as string));
        return;
      }
      const params = {
        check_in: sel.startDate.toISOString().split('T')[0],
        check_out: sel.endDate.toISOString().split('T')[0],
        guests,
      };
      setLocalError(null);
      dispatch(fetchAvailability(params));
      afterSearch?.(params);
    },
    [dispatch, range, guests, afterSearch, t]
  );

  // ====== densidades ======
  const density = tight ? 'tight' : dense ? 'dense' : 'normal';

  const H = density === 'tight' ? 'h-9' : density === 'dense' ? 'h-10' : 'h-12';
  const PX =
    density === 'tight' ? 'px-2.5' : density === 'dense' ? 'px-3' : 'px-4';
  const PY =
    density === 'tight' ? 'py-1.5' : density === 'dense' ? 'py-2' : 'py-3';
  const GAP =
    density === 'tight'
      ? 'gap-1.5 md:gap-2'
      : density === 'dense'
        ? 'gap-2 md:gap-3'
        : 'gap-4 md:gap-6';
  const ICON = density === 'tight' ? 14 : density === 'dense' ? 16 : 20;
  const TEXT_SM =
    density === 'tight'
      ? 'text-xs'
      : density === 'dense'
        ? 'text-xs'
        : 'text-sm';
  const BTN_H = H;
  const BTN_PX =
    density === 'tight' ? 'px-3' : density === 'dense' ? 'px-4' : 'px-6';
  const MIN_W =
    density === 'tight'
      ? 'min-w-[140px]'
      : density === 'dense'
        ? 'min-w-[160px]'
        : 'min-w-[220px]';
  const W_DATE =
    density === 'tight'
      ? 'w-[200px]'
      : density === 'dense'
        ? 'w-[240px]'
        : 'w-[260px]';
  const W_GUEST =
    density === 'tight'
      ? 'w-[170px]'
      : density === 'dense'
        ? 'w-[210px]'
        : 'w-[230px]';

  const container = bare
    ? density === 'tight'
      ? 'space-y-1'
      : density === 'dense'
        ? 'space-y-2'
        : 'space-y-4'
    : density === 'tight'
      ? 'p-2 space-y-2 bg-white dark:bg-dozebg1 rounded-md shadow-sm'
      : density === 'dense'
        ? 'p-3 space-y-3 bg-white dark:bg-dozebg1 rounded-lg shadow-md'
        : 'p-6 space-y-6 bg-white dark:bg-dozebg1 rounded-xl shadow-lg';

  return (
    <div className={`${container} ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className={`flex flex-wrap items-center justify-center ${GAP}`}>
          {/* Fechas */}
          <div className="relative" ref={calendarRef}>
            <div
              onClick={() => setShowCalendar((v) => !v)}
              className={`flex items-center gap-2 border border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10 ${PX} ${PY} ${H} rounded-md shadow-sm cursor-pointer hover:ring-2 ring-dozeblue transition ${W_DATE}`}
            >
              <CalendarDays className="text-dozeblue" size={ICON} />
              <span
                className={`text-[var(--foreground)] ${TEXT_SM} font-medium truncate`}
              >
                {format(range[0].startDate!, 'dd MMM')} —{' '}
                {format(range[0].endDate!, 'dd MMM')}
              </span>
            </div>

            {showCalendar && (
              <div className="absolute z-50 mt-1 shadow-xl rounded-xl overflow-hidden border dark:border-white/20 bg-white dark:bg-dozebg1">
                <DateRange
                  ranges={range}
                  onChange={(item: RangeKeyDict) => {
                    const s = item.selection;
                    if (s) setRange([s]);
                  }}
                  moveRangeOnFirstSelection={false}
                  rangeColors={['#2463eb']}
                  minDate={new Date()}
                  showDateDisplay={false}
                />
              </div>
            )}
          </div>

          {/* Huéspedes */}
          <div
            className={`flex items-center gap-2 border border-gray-300 dark:border-white/20 bg-white dark:bg-dozegray/10 ${PX} ${H} rounded-md shadow-sm ${W_GUEST}`}
          >
            <User className="text-dozeblue" size={ICON} />
            <span className={`${TEXT_SM} text-[var(--foreground)]`}>
              {t('seeker.guests')}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className={`w-6 ${H} grid place-items-center rounded border border-gray-300 dark:border-white/30 text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-dozegray/30`}
                aria-label="Restar huéspedes"
              >
                −
              </button>
              <span
                className={`w-5 text-center ${TEXT_SM} text-[var(--foreground)]`}
              >
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => g + 1)}
                className={`w-6 ${H} grid place-items-center rounded border border-gray-300 dark:border-white/30 hover:bg-gray-100 dark:hover:bg-dozegray/30`}
                aria-label="Sumar huéspedes"
              >
                +
              </button>
            </div>
          </div>

          {/* Buscar */}
          <button
            type="submit"
            className={`flex items-center justify-center gap-2 ${BTN_H} ${BTN_PX} rounded-md bg-greenlight text-dozeblue hover:bg-dozeblue/90 hover:text-white transition font-semibold`}
          >
            <Search className={density === 'tight' ? 'w-4 h-4' : 'w-5 h-5'} />
            <span className={TEXT_SM}>{t('seeker.search')}</span>
          </button>

          {/* Acciones en la misma fila */}
          {showActions && (
            <div className={`flex items-center ${GAP}`}>
              <button
                type="button"
                onClick={() =>
                  window.open(
                    '/fns-booking-frame',
                    '_blank',
                    'width=600,height=700,scrollbars=yes,resizable=yes'
                  )
                }
                className={`${MIN_W} ${BTN_H} ${BTN_PX} rounded-full border border-dozeblue text-dozeblue hover:bg-dozeblue hover:text-white transition font-medium ${TEXT_SM}`}
              >
                {t('seeker.expandSearch')}
              </button>

              <AnimatedButton
                text={t('seeker.knowZones')}
                sectionId="#zones"
                className={`${MIN_W} ${BTN_H} ${BTN_PX} rounded-full ${TEXT_SM}`}
              />
            </div>
          )}
        </div>

        {localError && (
          <p className="text-red-600 text-xs pt-1">{localError}</p>
        )}
      </form>
    </div>
  );
}
