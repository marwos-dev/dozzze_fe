// src/components/ui/seeker/SeekerResults.tsx
'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import SkeletonAvailabilityResult from '@/components/ui/skeletons/AvailabilityResultSkeleton';
import AvailabilityResult from '@/components/ui/AvailabilityResult';
import RoomError from '@/components/ui/errors/RoomError';
import { useLanguage } from '@/i18n/LanguageContext';

type Props = {
  className?: string;
  showActions?: boolean; // botones extra debajo
};

export default function SeekerResults({
  className = '',
  showActions = true,
}: Props) {
  const { availability, loading, error } = useSelector(
    (s: RootState) => s.properties
  );
  const { t } = useLanguage();

  const noRooms = t('seeker.noRooms');
  const noRoomsMsg = Array.isArray(noRooms)
    ? noRooms.join(' ')
    : (noRooms as string);

  // Antes de la primera búsqueda, no mostramos nada
  if (!loading && !error && (!availability || availability.length === 0))
    return null;

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {error && <RoomError message={noRoomsMsg} />}

      {loading && (
        <div className="text-center text-dozegray">
          <SkeletonAvailabilityResult />
        </div>
      )}

      {!!availability?.length && <AvailabilityResult />}

      {showActions && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <button
            onClick={() =>
              window.open(
                '/fns-booking-frame',
                '_blank',
                'width=600,height=700,scrollbars=yes,resizable=yes'
              )
            }
            className="min-w-[200px] text-dozeblue border border-dozeblue px-4 py-2 rounded-full hover:bg-dozeblue hover:text-white transition font-medium text-center"
          >
            {t('seeker.expandSearch')}
          </button>
        </div>
      )}
    </section>
  );
}
