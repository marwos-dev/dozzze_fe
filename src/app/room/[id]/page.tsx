"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { CheckCircle, Users } from "lucide-react";
import type { RootState } from "@/store";

export default function RoomDetailPage() {
  const { id } = useParams();
  const roomId = typeof id === "string" ? id : id?.[0];

  const { property, loading, error } = useSelector(
    (state: RootState) => state.properties
  );
  const room = property?.rooms?.find((r) => String(r.id) === roomId);

  if (loading) return <p className="text-center">Cargando habitación...</p>;
  if (error || !property)
    return (
      <p className="text-center text-red-500">Error cargando habitacion</p>
    );
  if (!room)
    return (
      <p className="text-center text-gray-500">Habitación no encontrada</p>
    );

  const mainImage = room.images[0] || "/placeholder.jpg";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Imagen destacada */}
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-lg">
        <Image src={mainImage} alt={room.name} fill className="object-cover" />
      </div>

      {/* Título y descripción */}
      <h1 className="text-3xl font-bold mt-6 text-dozeblue">{room.name}</h1>
      <p className="mt-2 text-gray-700">{room.description}</p>

      {/* Capacidad */}
      <div className="mt-4 flex items-center gap-2 text-gray-800">
        <Users className="w-5 h-5" />
        <span>
          Capacidad: {room.pax} persona{room.pax > 1 ? "s" : ""}
        </span>
      </div>

      {/* Servicios */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {(room.services ?? []).length > 0 ? (
          (room.services ?? []).map((service: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="text-green-500 w-4 h-4" />
              {service}
            </li>
          ))
        ) : (
          <li className="text-gray-400">No se especificaron servicios</li>
        )}
      </ul>

      {/* Galería adicional */}
      {room.images.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-dozeblue mb-2">Galería</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {room.images.slice(1).map((img: string, i: number) => (
              <div
                key={i}
                className="relative w-full h-40 rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Imagen ${i + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
