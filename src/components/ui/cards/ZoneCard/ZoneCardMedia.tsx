'use client';
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from 'framer-motion';
import type { LatLngExpression } from 'leaflet';

const MapView = dynamic(() => import('../../maps/MapZoneVIew'), { ssr: false });

interface ZoneCardMediaProps {
    showMap: boolean;
    imageUrl: string;
    destination: string;
    coordinates: LatLngExpression[];
}

export default function ZoneCardMedia({ showMap, imageUrl, destination, coordinates }: ZoneCardMediaProps) {
    return (
        <motion.div
            className="relative w-full h-[220px] sm:h-[250px] mx-auto shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
        >
            {showMap ? (
                <MapView coordinates={coordinates} />
            ) : (
                <Image
                    src={imageUrl}
                    alt={destination}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-none"
                />
            )}
        </motion.div>
    );
}
