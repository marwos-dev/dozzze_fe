"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getZones } from "@/store/zoneSlice";
import type { AppDispatch, RootState } from "@/store";
import ZoneCard from "../ui/cards/ZoneCard/ZoneCard";
import { extractPoints } from "@/utils/mapUtils/extractPoints";
import { parseAreaToCoordinates } from "@/utils/mapUtils/parseAreaToCoordiantes";
import Spinner from "@/components/ui/spinners/Spinner";
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

  if (loading) return <Spinner />;

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

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
