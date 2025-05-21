"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { CheckCircle, Users } from "lucide-react";
import type { RootState } from "@/store";
import { useState } from "react";

export default function RoomDetailPage() {
  const { id } = useParams();
  const roomId = typeof id === "string" ? id : id?.[0];

  const { property, loading, error } = useSelector(
    (state: RootState) => state.properties
  );
  const room = property?.rooms?.find((r) => String(r.id) === roomId);

  const services = room?.services ?? [];
  const images = room?.images ?? [];

  const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.jpg");

  if (loading)
    return <p className="text-center text-dozeblue">Cargando habitación...</p>;
  if (error || !property)
    return (
      <p className="text-center text-red-500">Error cargando habitación</p>
    );
  if (!room)
    return (
      <p className="text-center text-gray-500">Habitación no encontrada</p>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-dozebg1 rounded-xl shadow-md">
      {/* Imagen principal */}
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow">
        <Image
          src={selectedImage}
          alt={room.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="mt-4 flex overflow-x-auto gap-3 pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${selectedImage === img
                  ? "border-dozeblue"
                  : "border-transparent"
                }`}
            >
              <Image
                src={img}
                alt={`Miniatura ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Info básica */}
      <div className="mt-6 space-y-3">
        <h1 className="text-3xl font-bold text-dozeblue">{room.name}</h1>
        <p className="text-gray-700">{room.description}</p>

        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          <span>
            Capacidad: {room.pax} persona{room.pax > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Servicios */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-dozeblue mb-2">Servicios</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {services.length > 0 ? (
            services.map((service, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-gray-700 bg-white rounded-md px-3 py-2 shadow-sm"
              >
                <CheckCircle className="text-green-500 w-4 h-4" />
                {service}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No se especificaron servicios</li>
          )}
        </ul>
      </div>
    </div>
  );
}
