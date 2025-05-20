import { Star } from "lucide-react";

interface PropertyCardInfoProps {
    name: string;
    address?: string;
    zone: string;
    description?: string;
    rating?: number;
}

export default function PropertyCardInfo({
    name,
    address,
    zone,
    description,
    rating = 4,
}: PropertyCardInfoProps) {
    return (
        <div className="flex flex-col justify-between flex-1 gap-2 bg-greenlight p-4 rounded-2xl">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-dozeblue">{name}</h2>
                <p className="text-dozeblue text-sm">{address || "Dirección no disponible"}</p>
                <p className="text-dozeblue font-semibold uppercase text-xs">{zone}</p>
                <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`} />
                    ))}
                    <span className="text-xs text-dozeblue font-semibold ml-2">{rating}.0</span>
                </div>
                <p className="text-dozegray text-sm pt-5 line-clamp-4 leading-snug">
                    {description || "Descripción no disponible"}
                </p>
            </div>

        </div>
    );
}
