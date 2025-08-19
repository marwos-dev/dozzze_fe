'use client';

import { useState, useRef, useEffect } from 'react';
import { DateRange, RangeKeyDict, Range } from 'react-date-range';
import { addDays, format } from 'date-fns';
import { CalendarDays, User, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchAvailability } from '@/store/propertiesSlice';
import SkeletonAvailabilityResult from '@/components/ui/skeletons/AvailabilityResultSkeleton';
import AnimatedButton from '../ui/buttons/AnimatedButton';
import AvailabilityResult from '../ui/AvailabilityResult';
import RoomError from '@/components/ui/errors/RoomError';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useLanguage } from '@/i18n/LanguageContext';

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
  const [hasFetched, setHasFetched] = useState(false);
  const { t } = useLanguage();

  const calendarRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {
    availability,
    loading,
    error: reduxError,
  } = useSelector((state: RootState) => state.properties);

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

  useEffect(() => {
    if (!hasFetched && availability.length === 0) {
      const selected = range[0];
      const formatted = {
        check_in: selected.startDate!.toISOString().split('T')[0],
        check_out: selected.endDate!.toISOString().split('T')[0],
        guests,
      };
      dispatch(fetchAvailability(formatted));
      setHasFetched(true);
    }
  }, [dispatch, hasFetched, guests, range, availability.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selected = range[0];
    if (!selected.startDate || !selected.endDate) {
      const msg = t('seeker.invalidDate');
      setError(Array.isArray(msg) ? msg.join(' ') : msg);
      return;
    }

    const formatted = {
      check_in: selected.startDate.toISOString().split('T')[0],
      check_out: selected.endDate.toISOString().split('T')[0],
      guests,
    };

    setError(null);
    dispatch(fetchAvailability(formatted));
  };

  const noRooms = t('seeker.noRooms');
  const noRoomsMsg = Array.isArray(noRooms) ? noRooms.join(' ') : noRooms;

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-dozebg1 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:gap-6">
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
              {t('seeker.guests')}
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
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-greenlight text-dozeblue hover:bg-dozeblue/90 hover:text-white transition font-semibold w-full md:w-auto"
          >
            <Search className="w-5 h-5" />
            {t('seeker.search')}
          </button>
        </div>
      </form>

      {error && <RoomError message={noRoomsMsg} />}
      {reduxError && <RoomError message={noRoomsMsg} />}
      {loading && (
        <div className="text-center text-dozegray">
          <SkeletonAvailabilityResult />
        </div>
      )}
      {!!availability.length && <AvailabilityResult />}

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
          {t('seeker.expandSearch')}
        </button>

        <AnimatedButton
          text={t('seeker.knowZones')}
          sectionId="#zones"
          className="min-w-[220px]"
        />
      </div>
    </div>
  );
}
