'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import PropertyEditModal from './PropertyEditModal';

interface Props {
  property: Property;
  onEdit: () => void;
}

export default function PropertiesOwnerCard({ property, onEdit }: Props) {
  const imageUrl = property.images[0] || '/logo.png';
  const [modalOpen, setModalOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // evitar que se dispare onEdit
    setModalOpen(true);
  };

  return (
    <>
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

        {/* Botón flotante con color dozeblue */}
        <button
          onClick={handleEditClick}
          className="absolute top-3 right-3 z-20 bg-dozeblue text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-md hover:bg-dozeblue/90 transition"
        >
          <Pencil size={14} className="text-white" />
          Editar propiedad
        </button>

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

          <div className="flex flex-col mt-4 text-sm gap-1">
            <span>
              <strong>{property.room_types?.length ?? 0}</strong> habitaciones
            </span>
            <span className="text-white/80 italic text-xs">
              Click para ver habitaciones
            </span>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <PropertyEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        property={property}
      />
    </>
  );
}
