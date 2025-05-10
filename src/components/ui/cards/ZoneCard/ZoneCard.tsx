'use client';
import { useState } from "react";
import type { LatLngExpression } from 'leaflet';
import ZoneCardMedia from './ZoneCardMedia';
import ZoneCardFooter from './ZoneCardFooter';
import ZoneCardHeader from './ZoneCardHeader';

interface ZoneCardProps {
    country: string;
    imageUrls: string[];
    coordinates: LatLngExpression[];
}

export default function ZoneCard({
    country,
    imageUrls,
    coordinates,
}: ZoneCardProps) {
    const [showMap, setShowMap] = useState(false);
    const [selectedImage, setSelectedImage] = useState(imageUrls[0]);

    const toggleMap = () => {
        setShowMap(prev => !prev);
    };

    return (
        <div className="w-full max-w-sm bg-greenlight shadow-xl px-2  sm:px-3 hover:shadow-2xl transform hover:scale-[1.01] transition-all text-center m-2 rounded-2xl overflow-hidden flex flex-col">

            <ZoneCardHeader
                country={country}
                showMap={showMap}
                toggleMap={toggleMap}
            />

            {/* Imagen/mapa */}
            <ZoneCardMedia
                showMap={showMap}
                selectedImage={selectedImage}
                coordinates={coordinates}
            />

            {/* Miniaturas y botón */}
            <ZoneCardFooter
                imageUrls={imageUrls}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setShowMap={setShowMap}
            />
        </div>
    );
}
