"use client";

import { use } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getZoneById } from "@/store/zoneSlice";
import PropertiesCard from "@/components/ui/cards/PropertiesCard/ProperitesCard";
import ZoneBanner from "@/components/ui/banners/ZoneBanner";
import { parseAreaToCoordinates } from "@/utils/mapUtils/parseAreaToCoordiantes";
import { extractPoints } from "@/utils/mapUtils/extractPoints";

import { Property } from "@/types/property";

interface PageProps {
  params: Promise<{ id: number }>;
}

export default function ZoneDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedZone,
    loading,
    error,
  } = useSelector((state: RootState) => state.zones);

  useEffect(() => {
    if (!selectedZone) {
      dispatch(getZoneById(id));
    }
  }, [id, dispatch, selectedZone]);

  if (loading || !selectedZone)
    return <p className="text-center mt-20 text-lg">Cargando zona...</p>;

  if (error)
    return (
      <p className="text-center mt-20 text-lg text-red-600">
        Zona no encontrada
      </p>
    );

  const zoneCoordinates = parseAreaToCoordinates(selectedZone.area);
  const pointsCoordinates = extractPoints(selectedZone.properties);

  return (
    <div className="w-full bg-dozebg2 mx-auto p-4 space-y-6">
      <div className="justify-center p-4 rounded-lg">
        <ZoneBanner
          zoneCoordinates={zoneCoordinates}
          pointsCoordinates={pointsCoordinates}
        />

        <h1 className="text-3xl text-center pt-3 font-bold text-dozeblue">
          {selectedZone.name}
        </h1>
      </div>

      {selectedZone.properties?.length > 0 ? (
        selectedZone.properties.map((property: Property) => (
          <div key={property.id} id={`property-${property.id}`}>
            <PropertiesCard {...property} />
          </div>
        ))
      ) : (
        <p className="text-dozegray text-center">
          No hay propiedades disponibles.
        </p>
      )}
    </div>
  );
}
