'use client';

import Image from 'next/image';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch } from '@/store';
import { MapPin, CalendarDays, User, Search } from 'lucide-react';
import { DateRange, RangeKeyDict, Range } from 'react-date-range';
import { addDays, format } from 'date-fns';
import {
  fetchAvailability,
  loadFullPropertyById,
} from '@/store/propertiesSlice';
import AvailabilityResult from '@/components/ui/AvailabilityResult';
import SkeletonAvailabilityResult from '@/components/ui/skeletons/AvailabilityResultSkeleton';
import PropertiesCardSkeleton from '@/components/ui/skeletons/PropertyCardSkeleton';
import {
  selectSelectedProperty,
  selectAvailability,
  selectPropertiesLoading,
  selectPropertiesError,
} from '@/store/selectors/propertiesSelectors';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = Number(params?.id);

  const dispatch = useDispatch<AppDispatch>();
  const property = useSelector(selectSelectedProperty);
  const availability = useSelector(selectAvailability);
  const loading = useSelector(selectPropertiesLoading);
  const reduxError = useSelector(selectPropertiesError);

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
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Cargar propiedad por ID
  useEffect(() => {
    if (!property && propertyId) {
      dispatch(loadFullPropertyById(propertyId));
    }
  }, [dispatch, property, propertyId]);

  // Búsqueda automática solo una vez
  useEffect(() => {
    if (property?.id && !hasFetched) {
      const selected = range[0];
      const formatted = {
        check_in: selected.startDate!.toISOString().split('T')[0],
        check_out: selected.endDate!.toISOString().split('T')[0],
        guests,
        property_id: property.id,
      };
      dispatch(fetchAvailability(formatted));
      setHasFetched(true);
    }
  }, [dispatch, property?.id]);

  // Cerrar calendario al hacer clic afuera
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

  // Enviar búsqueda manual (formulario)
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
    setError(null);
    dispatch(fetchAvailability(formatted));
    setHasFetched(true);
  };

  if (!property)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <PropertiesCardSkeleton />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Presentación */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="relative w-full h-[240px] md:h-[320px] rounded-xl overflow-hidden">
          <Image
            src={property.cover_image || '/logo.png'}
            alt={`Imagen de ${property.name}`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
              {property.name}
            </h1>
            <p className="text-sm md:text-base text-white drop-shadow flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              {property.address || 'Dirección no disponible'}
            </p>
            {property.description && (
              <p className="text-xs md:text-sm text-white/90 max-w-3xl line-clamp-3 md:line-clamp-4">
                {property.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-center items-stretch md:items-center gap-4 md:gap-6 max-w-4xl mx-auto">
          {/* Calendario */}
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

          {/* Huéspedes */}
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

          {/* Botón buscar */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-greenlight text-dozeblue hover:bg-dozeblue/90 hover:text-white transition font-semibold w-full md:w-auto"
          >
            <Search className="w-5 h-5" />
            Buscar
          </button>
        </div>
      </form>

      {/* Errores y resultado */}
      {error && <p className="text-red-500">{error}</p>}
      {reduxError && <p className="text-red-500">{reduxError}</p>}

      {loading ? (
        <SkeletonAvailabilityResult />
      ) : hasFetched && !!availability.length ? (
        <AvailabilityResult guests={guests} />
      ) : null}
    </div>
  );
}
