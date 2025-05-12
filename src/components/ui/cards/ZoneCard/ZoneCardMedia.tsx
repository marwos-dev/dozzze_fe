'use client';
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from 'framer-motion';
import type { LatLngExpression } from 'leaflet';

const MapView = dynamic(() => import('../../maps/MapZoneVIew'), { ssr: false });

interface ZoneCardMediaProps {
    showMap: boolean;
    selectedImage: string;
    coordinates: LatLngExpression[];
}

export default function ZoneCardMedia({
    showMap,
    selectedImage,
    coordinates
}: ZoneCardMediaProps) {
    return (
        <motion.div
            className="relative w-full h-[220px] sm:h-[250px] mx-auto shadow-md overflow-hidden rounded-t-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
        >
            <AnimatePresence mode="wait">
                {showMap ? (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <MapView coordinates={coordinates} />
                    </motion.div>
                ) : (
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={selectedImage}
                            alt="Imagen de la zona"
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-none"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
