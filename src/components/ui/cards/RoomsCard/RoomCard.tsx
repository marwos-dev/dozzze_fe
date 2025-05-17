'use client';
import Image from 'next/image';
import { useState } from 'react';
import { BedDouble, Users } from 'lucide-react';

interface RoomCardProps {
    name: string;
    description: string;
    pax: number;
    images: string[];
    features?: string[];
}

export default function RoomCard({ name, description, pax, images, features = [] }: RoomCardProps) {
    const [mainImage, setMainImage] = useState(images[0]);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 flex flex-col gap-3">
            <div className="relative w-full h-[180px] rounded-lg overflow-hidden">
                <Image src={mainImage} alt={name} fill className="object-cover" />
            </div>

            <div className="flex gap-2">
                {images.slice(0, 4).map((img, i) => (
                    <button key={i} onClick={() => setMainImage(img)} className="relative w-16 h-12 rounded-lg overflow-hidden">
                        <Image src={img} alt={`room-thumb-${i}`} fill className="object-cover" />
                    </button>
                ))}
            </div>

            <h3 className="text-lg font-semibold text-dozeblue">{name}</h3>
            <p className="text-sm text-dozegray">{description}</p>

            <div className="flex gap-3 items-center text-sm text-dozeblue">
                <Users className="w-4 h-4" /> {pax} personas
                <BedDouble className="w-4 h-4" /> {features.join(', ')}
            </div>
        </div>
    );
}
