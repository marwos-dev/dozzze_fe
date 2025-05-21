"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
} from "lucide-react";

interface RoomCardProps {
  id: number | string;
  name: string;
  description: string;
  pax: number;
  services: string[];
  images: string[];
}

export default function RoomCard({
  id,
  name,
  description,
  pax,
  services,
  images,
}: RoomCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const hasMultipleImages = images.length > 1;
  const mainImage = images?.[currentImage] ?? "/images/img1.jpg";

  const formatPax = (count: number) =>
    `Capacidad: ${count} persona${count !== 1 ? "s" : ""}`;

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-dozebg1">
      {/* Slider o imagen única */}
      <div className="relative w-full h-[200px]">
        <Image
          key={mainImage}
          src={mainImage}
          alt={`${name} - Imagen ${currentImage + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
        />

        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-3">
          <h3 className="text-lg font-bold">{name}</h3>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2">
        <p className="text-dozeblue text-sm">{description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users className="w-4 h-4" />
          <span>{formatPax(pax)}</span>
        </div>

        {/* Servicios expandibles */}
        <div
          className={`transition-all duration-300 ease-in-out ${expanded ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <div className="flex flex-col gap-1">
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
        </div>

        {/* Botón mostrar más / menos */}
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="mt-3 self-start bg-greenlight text-dozeblue px-3 py-1.5 text-sm rounded-full flex items-center gap-1 hover:bg-blue-100 transition"
        >
          {expanded ? "Mostrar menos" : "Mostrar más"}
          <span
            className={`transform transition-transform duration-200 ${expanded ? "rotate-180" : ""
              }`}
          >
            <ChevronDown className="w-4 h-4" />
          </span>
        </button>

        {/* Botón de inspección */}
        <Link href={`/room/${id}`}>
          <button className="mt-4 w-full bg-dozeblue text-greenlight py-2 rounded hover:bg-opacity-90 transition">
            Inspeccionar habitación
          </button>
        </Link>
      </div>
    </div>
  );
}
