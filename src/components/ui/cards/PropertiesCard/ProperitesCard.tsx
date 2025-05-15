'use client';

import { useState } from 'react';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PropertiesCardProps {
    title: string;
    location: string;
    description: string;
    stars: number;
    tripRating: number;
    priceGuarantee?: boolean;
    images: string[];
    link: string;
}

export default function PropertiesCard({
    title,
    location,
    description,
    stars,
    tripRating,
    priceGuarantee = true,
    images,
    link,
}: PropertiesCardProps) {
    const totalStars = 5;

    const [mainImage, setMainImage] = useState(images[0]);
    const thumbnails = images.filter((img) => img !== mainImage).slice(0, 3);
    const extraImagesCount = images.length - 1 - thumbnails.length;

    return (
        <div className="bg-dozebg1 rounded-3xl shadow-md overflow-hidden flex flex-col md:flex-row p-3 gap-4 min-h-[240px]">
            {/* Imágenes - izquierda */}
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
            {/* Información - centro */}
            <div className="flex flex-col justify-between flex-1 gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center text-dozeblue justify-between">
                        <h2 className="text-xl font-bold text-dozeblue">{title}</h2>
                        {priceGuarantee && (
                            <div className="text-dozeblue flex items-center gap-1">
                                <CheckCircle className="text-orange-400 w-4 h-4" />
                                <span className="text-sm">Price Guarantee</span>
                            </div>
                        )}
                    </div>

                    <p className="text-dozeblue font-semibold uppercase text-xs">{location}</p>

                    <div className="flex items-center gap-3">
                        <div className="flex text-yellow-400">
                            {[...Array(stars)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400" />
                            ))}
                            {[...Array(totalStars - stars)].map((_, i) => (
                                <Star key={i + stars} className="w-4 h-4 text-gray-300" />
                            ))}
                        </div>

                        <div className="flex gap-1 items-center">
                            {[...Array(tripRating)].map((_, i) => (
                                <span key={i} className="w-3 h-3 bg-green-600 rounded-full inline-block" />
                            ))}
                        </div>
                    </div>

                    <p className="text-dozegray leading-tight">{description}</p>
                </div>
                {/* Botón desktop alineado abajo a la derecha */}
                <div className="hidden md:flex justify-end">
                    <Link
                        href={link}
                        className="mt-2 inline-flex mr-6 justify-center items-center bg-dozeblue text-white px-4 py-1.5 text-sm rounded-full font-medium hover:bg-blue-900 transition"
                    >
                        Ver Habitaciones
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
            {/* Mobile botón al final */}
            <div className="md:hidden pt-2">
                <Link
                    href={link}
                    className="inline-flex justify-center items-center bg-dozeblue text-white px-4 py-1.5 text-sm rounded-md font-medium w-full hover:bg-blue-900 transition"
                >
                    Ver Habitaciones
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
}
