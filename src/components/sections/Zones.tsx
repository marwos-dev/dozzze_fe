"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getZones } from "@/store/zoneSlice";
import type { AppDispatch, RootState } from "@/store";
import ZoneCard from "../ui/cards/ZoneCard/ZoneCard";
import type { LatLngExpression } from "leaflet";
import type { PointWithMedia } from "@/types/map";
import type { Zone } from "@/types/zone";

function parseAreaToCoordinates(area: string): LatLngExpression[] {
  try {
    const parsed = JSON.parse(area);
    return parsed.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
  } catch {
    return [];
  }
}

function extractPoints(properties: Zone["properties"]): PointWithMedia[] {
  return properties.map((prop) => {
    const coords = JSON.parse(prop.location).coordinates;
    return {
      position: [coords[1], coords[0]],
      images: prop.images,
    };
  });
}

export default function ZoneSection() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: zones,
    loading,
    error,
  } = useSelector((state: RootState) => state.zones);
  useEffect(() => {
    dispatch(getZones());
  }, [dispatch]);

  if (loading) return <p className="text-center">Cargando zonas...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="relative py-10">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,_theme(colors.dozebg1)_65%,_theme(colors.greenlight)_75%)]" />
      <div className="flex flex-wrap justify-center gap-6">
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
