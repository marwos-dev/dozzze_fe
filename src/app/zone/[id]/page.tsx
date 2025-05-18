'use client';

import { use } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { getZoneById, setSelectedZone } from '@/store/zoneSlice';
import PropertiesCard from '@/components/ui/cards/PropertiesCard/ProperitesCard';
import { Zone } from '@/types/zone';
import { Property } from '@/types/property';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ZoneDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const dispatch = useDispatch<AppDispatch>();

    const { selectedZone, loading, error, data: zones } = useSelector(
        (state: RootState) => state.zones
    );

    useEffect(() => {
        const existingZone: Zone | undefined = zones.find((zone) => String(zone.id) === id);

        if (existingZone) {
            dispatch(setSelectedZone(existingZone));
        } else {
            dispatch(getZoneById(id));
        }
    }, [id, zones, dispatch]);

    if (loading) return <p className="text-center mt-20 text-lg">Cargando zona...</p>;
    if (error || !selectedZone)
        return (
            <p className="text-center mt-20 text-lg text-red-600">
                Zona no encontrada
            </p>
        );

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold text-dozeblue">
                Propiedades en {selectedZone.name}
            </h1>

            {selectedZone.properties?.length > 0 ? (
                selectedZone.properties.map((property: Property) => (
                    <PropertiesCard key={property.id} {...property} />
                ))
            ) : (
                <p className="text-dozegray text-center">No hay propiedades disponibles.</p>
            )}
        </div>
    );
}
