'use client';

import { Property } from '@/types/property';
import { Pencil } from 'lucide-react';
import Image from 'next/image';

interface Props {
  property: Property;
  onEdit: () => void;
}

export default function PropertiesOwnerCard({ property, onEdit }: Props) {
  const imageUrl = property.cover_image || '/logo.png';

  return (
    <div
      onClick={onEdit}
      className="relative rounded-xl overflow-hidden shadow-md group border border-gray-200 dark:border-white/10 cursor-pointer"
      style={{ minHeight: 180 }}
    >
      {/* Imagen de fondo */}
      <Image
        src={imageUrl}
        alt={property.name}
        fill
        priority={false}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition" />

      {/* Contenido sobre la imagen */}
      <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{property.name}</h2>
          <p className="text-sm text-white/80">
            {property.address}
            {property.zone && (
              <>
                , <span className="font-medium">{property.zone}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm">
          <span>
            <strong>{property.room_types?.length ?? 0}</strong> habitaciones
          </span>
          <div className="flex items-center gap-1 text-white text-sm opacity-70">
            <Pencil size={16} />
            Editar
          </div>
        </div>
      </div>
    </div>
  );
}
