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
      className="relative rounded-xl overflow-hidden shadow-md group border border-gray-200 dark:border-white/10"
      style={{ minHeight: 180 }}
    >
      {/* Fondo con imagen y overlay oscuro */}
      <Image
        src={imageUrl}
        alt={property.name}
        fill
        priority={false}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition" />

      {/* Contenido */}
      <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{property.name}</h2>
          <p className="text-sm text-white/80">
            {property.address},{' '}
            <span className="font-medium">{property.zone}</span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm">
          <span>
            <strong>{property.room_types?.length ?? 0}</strong> habitaciones
          </span>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-white hover:text-white/80 text-sm border border-white px-2 py-1 rounded-md"
          >
            <Pencil size={16} /> Editar
          </button>
        </div>
      </div>
    </div>
  );
}
