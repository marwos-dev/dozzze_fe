'use client';

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from "react";
import type { LatLngExpression } from 'leaflet';
import { Maximize, Minimize, Expand } from "lucide-react";

const MapView = dynamic(() => import('../../maps/MapZoneVIew'), { ssr: false });
const MapModal = dynamic(() => import('../../maps/MapModal'), { ssr: false });

interface ZoneCardMediaProps {
    showMap: boolean;
    selectedImage: string;
    coordinates: LatLngExpression[];
    showOverlayMap: boolean;
    setShowOverlayMap: (value: boolean) => void;
    cardHeight: number;
}


export default function ZoneCardMedia({
    showMap,
    selectedImage,
    coordinates
}: ZoneCardMediaProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showOverlayMap, setShowOverlayMap] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleExpand = () => setShowOverlayMap(true);
    const handleCollapse = () => setShowOverlayMap(false);

    return (
        <>
            {/* Vista principal de la tarjeta */}
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
                            <button
                                onClick={handleExpand}
                                className="absolute bottom-1 right-1 bg-dozeblue text-white px-2 py-1 rounded shadow-md hover:bg-opacity-90 flex items-center gap-1 text-xs z-10"
                            >
                                <Expand className="w-4 h-4" />
                                Expandir
                            </button>
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

            {/* Modal pantalla completa */}
            <MapModal
                isOpen={isModalOpen}
                onClose={closeModal}
                coordinates={coordinates}
            />

            {/* Overlay sobre toda la tarjeta */}
            {showOverlayMap && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-30 bg-white shadow-xl rounded-2xl overflow-hidden"
                >
                    <MapView coordinates={coordinates} />

                    {/* Botones arriba a la derecha */}
                    <div className="absolute top-2 right-2 flex gap-2 z-50">
                        <button
                            onClick={handleCollapse}
                            className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
                            title="Cerrar vista expandida"
                        >
                            <Minimize className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={openModal}
                            className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
                            title="Pantalla completa"
                        >
                            <Maximize className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </motion.div>
            )}
        </>
    );
}
