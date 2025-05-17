'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import PropertiesCard from '@/components/ui/cards/PropertiesCard/ProperitesCard';

export default function Properties() {
    const { data: zones, loading, error } = useSelector((state: RootState) => state.zones);

    if (loading) return <p>Cargando propiedades...</p>;
    if (error) return <p>Hubo un error al cargar las zonas</p>;

    return (
        <section className="max-w-6xl bg-greenlight mx-auto mt-10 p-4 space-y-6">
            {zones?.map((zone) =>
                zone.properties?.map((property: any) => (
                    <PropertiesCard
                        key={property.id}
                        id={property.id}
                        name={property.name}
                        zone={zone.name}
                        description={property.description || ''}
                        cover_image={property.cover_image}
                        images={property.images || []}
                        rooms={property.rooms?.map((room: any) => ({
                            id: room.id,
                            name: room.name,
                            description: room.description,
                            pax: room.pax,
                            images: room.images || [],
                            features: room.features || [],
                        }))} address={''} />
                ))
            )}
        </section>
    );
}
