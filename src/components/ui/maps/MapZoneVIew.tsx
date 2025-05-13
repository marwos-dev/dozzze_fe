'use client';

import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PointWithMedia } from '@/types/map';
import Image from 'next/image';

interface MapViewProps {
    zoneCoordinates: LatLngExpression[];
    pointsCoordinates?: PointWithMedia[];
}

function FitBounds({ zoneCoordinates, pointsCoordinates }: MapViewProps) {
    const map = useMap();

    useEffect(() => {
        const allPoints = pointsCoordinates
            ? [...zoneCoordinates, ...pointsCoordinates.map(p => p.position)]
            : zoneCoordinates;
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
            <Polygon positions={zoneCoordinates} pathOptions={{ color: '#808080' }} />
            {pointsCoordinates.map((point, index) => (
                <Marker key={index} position={point.position} icon={gpsIcon}>

                    <Popup maxWidth={600}>
                        {point.images && point.images.length > 0 ? (
                            <div className="flex flex-col gap-3 w-[200px]">
                                {point.images.map((url, i) => (
                                    <div key={i} className="relative w-[200px] h-[150px] rounded overflow-hidden">
                                        <Image
                                            src={url}
                                            alt={`Foto ${i + 1}`}
                                            fill
                                            objectFit="cover"
                                            className="rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-base">Ubicación registrada</span>
                        )}
                    </Popup>

                </Marker>
            ))}
            <FitBounds zoneCoordinates={zoneCoordinates} pointsCoordinates={pointsCoordinates} />
        </MapContainer>
    );
}
