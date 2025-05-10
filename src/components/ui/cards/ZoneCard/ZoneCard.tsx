'use client';
import { useState } from "react";
import type { LatLngExpression } from 'leaflet';

import ZoneCardHeader from "./ZoneCardHeader";
import ZoneCardMedia from "./ZoneCardMedia";
import ZoneCardFooter from "./ZoneCardFooter";

interface ZoneCardProps {
    country: string;
    destination: string;
    duration: string;
    imageUrl: string;
    coordinates: LatLngExpression[];
}

export default function ZoneCard({
    country,
    destination,
    duration,
    imageUrl,
    coordinates,
}: ZoneCardProps) {
    const [showMap, setShowMap] = useState(false);

    return (
        <div className="w-full max-w-sm bg-greenlight shadow-xl px-2 hover:shadow-2xl transform hover:scale-[1.01] transition-all text-center m-4 rounded-2xl overflow-hidden flex flex-col">
            <ZoneCardHeader
                country={country}
                showMap={showMap}
                toggleMap={() => setShowMap(!showMap)}
            />
            <ZoneCardMedia
                showMap={showMap}
                imageUrl={imageUrl}
                destination={destination}
                coordinates={coordinates}
            />
            <ZoneCardFooter
                destination={destination}
                duration={duration}
            />
        </div>
    );
}
