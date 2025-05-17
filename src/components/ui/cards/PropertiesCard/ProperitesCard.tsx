'use client';

import { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from "@/types/property";


export default function PropertiesCard({
    id,
    name,
    zone,
    description,
    cover_image,
    images,
    rooms = [],
}: Property) {
    const [mainImage, setMainImage] = useState(cover_image || images[0]);
    const thumbnails = images.filter((img) => img !== mainImage).slice(0, 3);
    const extraImagesCount = images.length - 1 - thumbnails.length;
    const rating = 4;
    return (
        <div className="bg-dozebg1 rounded-3xl shadow-md overflow-hidden flex flex-col md:flex-row p-3 gap-4 min-h-[240px]">
            {/* Imagen principal y miniaturas */}
            <div className="flex flex-col w-full md:w-[400px] gap-2">
                {/* Desktop */}
                <div className="hidden md:flex gap-2 h-full">
                    <div className="flex flex-col gap-2">
                        {thumbnails.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setMainImage(src)}
                                className="relative w-[70px] h-[48px] rounded-xl overflow-hidden border border-white shadow-sm hover:scale-[1.03] transition"
                            >
                                <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                        {extraImagesCount > 0 && (
                            <div className="relative w-[70px] h-[48px] rounded-xl overflow-hidden border border-white shadow-sm bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                                +{extraImagesCount}
                            </div>
                        )}
                    </div>
                    <div className="relative flex-1 rounded-xl overflow-hidden h-[220px]">
                        <Image src={mainImage} alt="Main image" fill className="object-cover" />
                    </div>
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-2 md:hidden">
                    <div className="relative w-full h-[180px] rounded-xl overflow-hidden">
                        <Image src={mainImage} alt="Main image" fill className="object-cover" />
                    </div>
                    <div className="flex gap-2">
                        {thumbnails.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setMainImage(src)}
                                className="relative w-[80px] h-[54px] rounded-xl overflow-hidden border border-white shadow-sm hover:scale-[1.03] transition"
                            >
                                <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                        {extraImagesCount > 0 && (
                            <div className="relative w-[80px] h-[54px] rounded-xl overflow-hidden border border-white shadow-sm bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                                +{extraImagesCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info y botón */}
            <div className="flex flex-col justify-between flex-1 gap-2">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-dozeblue">{name}</h2>
                    <div className="flex items-center gap-1">
                        {/* Estrellas */}
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                            />
                        ))}
                        <span className="text-xs text-dozeblue font-semibold ml-2">{rating}.0</span>
                    </div>
                    <p className="text-dozeblue font-semibold uppercase text-xs">{zone}</p>
                    <p className="text-dozegray leading-tight">{description}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-semibold text-dozeblue">
                        Habitaciones disponibles: {rooms.length}
                    </p>

                    <div className="hidden md:flex justify-end">
                        <Link
                            href={`/properties/${id}`}
                            className="inline-flex mr-6 justify-center items-center bg-dozeblue text-white px-4 py-1.5 text-sm rounded-full font-medium hover:bg-blue-900 transition"
                        >
                            Ver Habitaciones
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Botón mobile */}
            <div className="md:hidden pt-2">
                <Link
                    href={`/properties/${id}`}
                    className="inline-flex justify-center items-center bg-dozeblue text-white px-4 py-1.5 text-sm rounded-md font-medium w-full hover:bg-blue-900 transition"
                >
                    Ver Habitaciones
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
}
