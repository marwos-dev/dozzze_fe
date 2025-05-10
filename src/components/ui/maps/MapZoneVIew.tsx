'use client';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
    coordinates: LatLngExpression[];
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
        </MapContainer>
    );
}
