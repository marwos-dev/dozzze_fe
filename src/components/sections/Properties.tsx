"use client";
import PropertiesCard from "@/components/ui/cards/PropertiesCard/ProperitesCard";
import { Property } from "@/types/property"
import { Zone } from "@/types/zone";

export default function Properties({ zones }: { zones: Zone[] }) {
  return (
    <section className="max-w-6xl bg-dozebg2 mx-auto">
      <div className="text-center bg-greenlight rounded-t-xl mb-1 mr-2 ml-2 py-3 px-2">
        <h2 className="text-3xl font-semibold text-dozeblue">
          Descubrí espacios únicos para tu estadía
        </h2>
        <p className="text-gray-700 mt-2">
          Lugares únicos disponibles en distintas zonas para tu próxima estadía
        </p>
      </div>
      {zones?.map((zone) =>
        zone.properties?.map((property:Property) => (
          <PropertiesCard key={property.id} {...property} zone={zone.name} />
        ))
      )}
    </section>
  );
}
