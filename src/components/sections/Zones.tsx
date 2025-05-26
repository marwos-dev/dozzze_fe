"use client";

import ZoneCard from "../ui/cards/ZoneCard/ZoneCard";
import { extractPoints } from "@/utils/mapUtils/extractPoints";
import { parseAreaToCoordinates } from "@/utils/mapUtils/parseAreaToCoordiantes";
import { Zone } from "@/types/zone";
 
export default function ZoneSection({ zones }: { zones: Zone[] }) {
  return (
    <div className="relative py-10">
      <div className="absolute inset-0 -z-10 bg-dozebg2" />
      <div className="flex flex-wrap justify-center bg-dozebg2 gap-6">
        {zones.map((zone) => (
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
