'use client';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import type { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
    coordinates: LatLngExpression[];
}

function FitBounds({ coordinates }: { coordinates: LatLngExpression[] }) {
    const map = useMap();

    useEffect(() => {
        const bounds: LatLngBoundsExpression = coordinates as LatLngBoundsExpression;
        map.fitBounds(bounds, { padding: [20, 20] });
    }, [map, coordinates]);

    return null;
}

export default function MapZoneView({ coordinates }: MapViewProps) {
    return (
        <MapContainer
            center={coordinates[0]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full z-0 rounded"
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polygon positions={coordinates} pathOptions={{ color: 'blue' }} />
            <FitBounds coordinates={coordinates} />
        </MapContainer>
    );
}
