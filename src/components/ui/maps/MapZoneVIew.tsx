'use client';

import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import type { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
    zoneCoordinates: LatLngExpression[];
    pointsCoordinates?: LatLngExpression[];
}

function FitBounds({ zoneCoordinates, pointsCoordinates }: { zoneCoordinates: LatLngExpression[]; pointsCoordinates?: LatLngExpression[] }) {
    const map = useMap();

    useEffect(() => {
        const allPoints = pointsCoordinates ? [...zoneCoordinates, ...pointsCoordinates] : zoneCoordinates;
        const bounds: LatLngBoundsExpression = allPoints as LatLngBoundsExpression;
        map.fitBounds(bounds, { padding: [20, 20] });
    }, [map, zoneCoordinates, pointsCoordinates]);

    return null;
}

const gpsIcon = new L.Icon({
    iconUrl: 'icons/pin.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export default function MapZoneView({ zoneCoordinates, pointsCoordinates = [] }: MapViewProps) {
    return (
        <MapContainer
            center={zoneCoordinates[0]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full z-0 rounded"
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polygon positions={zoneCoordinates} pathOptions={{ color: 'green' }} />
            {pointsCoordinates.map((position, index) => (
                <Marker key={index} position={position} icon={gpsIcon} />
            ))}
            <FitBounds zoneCoordinates={zoneCoordinates} pointsCoordinates={pointsCoordinates} />
        </MapContainer>
    );
}
