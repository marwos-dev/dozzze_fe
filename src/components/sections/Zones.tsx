import SkeletonCard from '../ui/skeletons/SkeletonCard';
import ZoneCard from '../ui/cards/ZoneCard/ZoneCard';
import { extractPoints } from '@/utils/mapUtils/extractPoints';
import { parseAreaToCoordinates } from '@/utils/mapUtils/parseAreaToCoordiantes';
import { Zone } from '@/types/zone';

interface ZoneSectionProps {
  zones: Zone[];
  loading: boolean;
}

export default function ZoneSection({ zones, loading }: ZoneSectionProps) {
  return (
    <div id="zones" className="relative py-10">
      <div className="absolute inset-0 -z-10 bg-dozebg2" />
      <div className="flex flex-wrap justify-center bg-dozebg2 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : zones.map((zone) => (
              <ZoneCard
                key={zone.id}
                id={zone.id}
                country={zone.name}
                imageUrls={zone.images}
                zoneCoordinates={parseAreaToCoordinates(zone.area)}
                pointsCoordinates={extractPoints(zone.properties)}
              />
            ))}
      </div>
    </div>
  );
}
