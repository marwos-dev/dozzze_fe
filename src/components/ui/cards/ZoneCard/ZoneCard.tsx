'use client';
import { useRef, useState, useEffect } from "react";
import type { LatLngExpression } from 'leaflet';
import ZoneCardMedia from './ZoneCardMedia';
import ZoneCardFooter from './ZoneCardFooter';
import ZoneCardHeader from './ZoneCardHeader';
import type { PointWithMedia } from '@/types/map';

interface ZoneCardProps {
    country: string;
    imageUrls: string[];
    zoneCoordinates: LatLngExpression[];
    pointsCoordinates: PointWithMedia[];
}

export default function ZoneCard({
    country,
    imageUrls,
    zoneCoordinates,
    pointsCoordinates
}: ZoneCardProps) {
    const [showMap, setShowMap] = useState(false);
    const [selectedImage, setSelectedImage] = useState(imageUrls[0]);
    const [showOverlayMap, setShowOverlayMap] = useState(false);

    const [mapCenter, setMapCenter] = useState<LatLngExpression>(zoneCoordinates[0]);
    const [mapZoom, setMapZoom] = useState<number>(13);

    const cardRef = useRef<HTMLDivElement>(null);
    const [cardHeight, setCardHeight] = useState(0);

    useEffect(() => {
        if (cardRef.current) {
            setCardHeight(cardRef.current.offsetHeight);
        }
    }, [showMap, selectedImage]);

    const toggleMap = () => setShowMap(prev => !prev);

    return (
        <div
            ref={cardRef}
            className="relative w-full max-w-sm bg-greenlight shadow-xl px-2 sm:px-3 transition-all text-center m-1 rounded-2xl overflow-hidden flex flex-col"
        >
            <ZoneCardHeader
                country={country}
                showMap={showMap}
                toggleMap={toggleMap}
            />

            <ZoneCardMedia
                showMap={showMap}
                selectedImage={selectedImage}
                zoneCoordinates={zoneCoordinates}
                pointsCoordinates={pointsCoordinates}
                showOverlayMap={showOverlayMap}
                setShowOverlayMap={setShowOverlayMap}
                cardHeight={cardHeight}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                setMapCenter={setMapCenter}
                setMapZoom={setMapZoom}
            />

            <ZoneCardFooter
                imageUrls={imageUrls}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setShowMap={setShowMap}
            />
        </div>
    );
}
