"use client";
import PropertiesCard from "@/components/ui/cards/PropertiesCard/ProperitesCard";
import { Property } from "@/types/property";
import { Zone } from "@/types/zone";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Properties({ zones }: { zones: Zone[] }) {
  const { t } = useLanguage();
  return (
    <section className="max-w-6xl bg-dozebg2 mx-auto">
      <div className="text-center bg-greenlight rounded-t-xl mb-1 mr-2 ml-2 py-3 px-2">
        <h2 className="text-3xl font-semibold text-dozeblue">
          {t('sections.discoverSpaces')}
        </h2>
        <p className="text-gray-700 mt-2">
          {t('sections.uniquePlaces')}
        </p>
      </div>
      {zones?.map((zone) =>
        zone.properties?.map((property: Property) => (
          <PropertiesCard key={property.id} {...property} zone={zone.name} />
        ))
      )}
    </section>
  );
}
