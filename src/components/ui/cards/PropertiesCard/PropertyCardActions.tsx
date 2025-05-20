import { ArrowRight, Phone, Mail, MessageCircleMore } from "lucide-react";
import Link from "next/link";

interface PropertyCardActionsProps {
    id: number;
    communication_methods: string[];
    roomsCount: number;
}

const getMethodIcon = (method: string) => {
    if (method.toLowerCase().includes("whatsapp")) return <MessageCircleMore className="w-4 h-4 mr-1" />;
    if (method.toLowerCase().includes("tel")) return <Phone className="w-4 h-4 mr-1" />;
    if (method.toLowerCase().includes("mail") || method.includes("@")) return <Mail className="w-4 h-4 mr-1" />;
    return <MessageCircleMore className="w-4 h-4 mr-1" />;
};

export default function PropertyCardActions({ id, communication_methods, roomsCount }: PropertyCardActionsProps) {
    return (
        <div className="flex flex-col justify-between mt-2 items-start md:items-end w-full md:w-[240px] gap-4">
            <div className="flex flex-wrap gap-2 w-full justify-start md:justify-end">
                {(communication_methods.length > 0 ? communication_methods : ["No disponible"]).map((method, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center text-sm bg-dozebg1 text-dozegray px-3 py-1 rounded-full border border-gray-300"
                    >
                        {getMethodIcon(method)}
                        {method}
                    </span>
                ))}
            </div>
            <div className="flex flex-col items-start md:items-end w-full gap-2">
                <p className="text-sm font-semibold text-dozeblue text-left md:text-right">
                    Habitaciones disponibles: {roomsCount}
                </p>
                <Link
                    href={`/properties/${id}`}
                    className="inline-flex items-center bg-dozeblue mb-1 text-white px-4 py-2 text-sm rounded-full font-medium hover:bg-blue-900 transition"
                >
                    Ver Habitaciones
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
}
