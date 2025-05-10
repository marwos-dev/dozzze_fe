'use client';
import Image from "next/image";
import { useState } from "react";
import type { LatLngExpression } from 'leaflet';
import dynamic from "next/dynamic";
import { MapPin, ImageIcon } from "lucide-react";
import { motion } from 'framer-motion';  // Importamos motion de framer-motion

const MapView = dynamic(() => import('../maps/MapZoneVIew'), { ssr: false });

interface ZoneCardProps {
    country: string;
    destination: string;
    hotel: string;
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
            <div className="flex justify-between items-center px-4 py-4">
                <h1 className="text-xl font-light tracking-widest font-sans text-gray-800">
                    {country}
                </h1>

                <button
                    onClick={() => setShowMap(!showMap)}
                    className="bg-dozeblue text-dozzegreenlight px-4 py-2 rounded-full transition-colors duration-300 flex items-center gap-2 min-w-[130px] justify-center w-[110px]"
                    aria-label={showMap ? "Ver imagen" : "Ver mapa"}
                    title={showMap ? "Ver imagen" : "Ver mapa"}
                >
                    {showMap ? (
                        <ImageIcon className="w-5 h-5" />
                    ) : (
                        <MapPin className="w-5 h-5" />
                    )}
                    <div className="w-[90px] text-sm text-center">
                        <motion.span
                            key={showMap ? "imagen" : "mapa"}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="block text-sm text-center whitespace-nowrap"
                        >
                            {showMap ? "Ver imagen" : "Ver mapa"}
                        </motion.span>
                    </div>
                </button>

            </div>
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

            <div className="bg-dozebg1 py-4 px-4 shadow-md">
                <h1 className="text-lg text-black">{destination}</h1>
                <p className="text-lg text-dozegray">{duration}</p>
            </div>

            <div className="py-4 px-4 flex justify-between items-center">
                {/* Botón principal: Explorar */}
                <button
                    onClick={() => alert('Explorar zona (futuro redireccionamiento)')}
                    className="bg-dozeblue text-greenlight text-sm px-4 py-2 rounded hover:bg-opacity-90  transition-all ease-in-out duration-300 w-full mr-2"
                >
                    Explorar zona
                </button>
            </div>
        </div>
    );
}
