'use client';

import {
    MapContainer,
    TileLayer,
    Polygon,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PointWithMedia } from '@/types/map';
import Image from 'next/image';
import { useEffect } from 'react';

interface MapViewProps {
    zoneCoordinates: LatLngExpression[];
    pointsCoordinates?: PointWithMedia[];
    center: LatLngExpression;
    zoom: number;
    onCenterChange: (center: LatLngExpression) => void;
    onZoomChange: (zoom: number) => void;
}

function TrackViewChanges({
    onCenterChange,
    onZoomChange,
}: Pick<MapViewProps, 'onCenterChange' | 'onZoomChange'>) {
    useMapEvents({
        moveend(e) {
            onCenterChange(e.target.getCenter());
        },
        zoomend(e) {
            onZoomChange(e.target.getZoom());
        },
    });
    return null;
}

function SyncMapView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();

        const latDiff = Math.abs(currentCenter.lat - (center as any).lat);
        const lngDiff = Math.abs(currentCenter.lng - (center as any).lng);
        const zoomDiff = Math.abs(currentZoom - zoom);

        const centerChanged = latDiff > 0.0001 || lngDiff > 0.0001;
        const zoomChanged = zoomDiff > 0;

        if (centerChanged || zoomChanged) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);

    return null;
}

const gpsIcon = new L.Icon({
    iconUrl: 'icons/pin.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export default function MapZoneView({
    zoneCoordinates,
    pointsCoordinates = [],
    center,
    zoom = 10,
    onCenterChange,
    onZoomChange,
}: MapViewProps) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
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
                                    <div
                                        key={i}
                                        className="relative w-[200px] h-[150px] rounded overflow-hidden"
                                    >
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

            <TrackViewChanges
                onCenterChange={onCenterChange}
                onZoomChange={onZoomChange}
            />
            <SyncMapView center={center} zoom={zoom} />
        </MapContainer>
    );
}
