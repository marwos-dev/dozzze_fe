'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Users, CheckCircle } from 'lucide-react';

interface RoomCardProps {
    name: string;
    description: string;
    pax: number;
    services: string[];
    images: string[];
}

export default function RoomCard({ name, description, pax, services, images }: RoomCardProps) {
    const [expanded, setExpanded] = useState(false);
    const mainImage = images[0] || '/placeholder.jpg';

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
            {/* Header: Imagen y nombre */}
            <div className="relative w-full h-[200px]">
                <Image
                    src={mainImage}
                    alt={name}
                    fill
                    className="object-cover"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-3">
                    <h3 className="text-lg font-bold">{name}</h3>
                </div>
            </div>

            {/* Cuerpo: Descripción, pax, servicios */}
            <div className="p-4 flex flex-col gap-2">
                <p className="text-dozeblue text-sm">{description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4" />
                    <span>Capacidad: {pax} persona{pax > 1 ? 's' : ''}</span>
                </div>

                {expanded && (
                    <div className="flex flex-col gap-1 mt-2">
                        <h4 className="font-semibold text-sm text-dozeblue">Servicios:</h4>
                        <ul className="text-sm text-gray-600 list-none flex flex-col gap-1">
                            {services.length > 0 ? (
                                services.map((service, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{service}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-400">No hay servicios listados</li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Botón expandir/colapsar */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                    {expanded ? 'Mostrar menos' : 'Mostrar más'}
                    {expanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>
            </div>
        </div>
    );
}
