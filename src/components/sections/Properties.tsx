"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PropertiesCard from "@/components/ui/cards/PropertiesCard/ProperitesCard";
import Spinner from "@/components/ui/spinners/Spinner";

export default function Properties() {
  const {
    data: zones,
    loading,
    error,
  } = useSelector((state: RootState) => state.zones);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;


  return (
    <section className="max-w-6xl bg-dozebg2 mx-auto">
      <div className="text-center bg-greenlight rounded-t-xl mb-1 py-4 px-2">
        <h2 className="text-3xl font-semibold text-dozeblue">Descubrí espacios únicos para tu estadía
        </h2>
        <p className="text-gray-700 mt-1">
          Lugares únicos disponibles en distintas zonas para tu próxima estadía
        </p>
      </div>
      {zones?.map((zone) =>
        zone.properties?.map((property) => (
          <PropertiesCard key={property.id} {...property} zone={zone.name} />
        ))
      )}
    </section>
  );
}
