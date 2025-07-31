'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Property } from '@/types/property';
import { Star, Mail, MessageCircleMore, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import slugify from '@/utils/slugify';

interface PropertyBannerProps {
  property: Property;
  roomsCount: number;
}

export default function PropertyBanner({
  property,
  roomsCount,
}: PropertyBannerProps) {
  const images =
    property.images.length > 0 ? property.images : [property.cover_image];
  const thumbnails = images.slice(0, 3);
  const [mainImage, setMainImage] = useState(property.cover_image || images[0]);

  const getMethodIcon = (method: string) => {
    if (method.toLowerCase().includes('whatsapp'))
      return <MessageCircleMore className="w-4 h-4 mr-1" />;
    if (method.toLowerCase().includes('tel'))
      return <Phone className="w-4 h-4 mr-1" />;
    if (method.toLowerCase().includes('mail') || method.includes('@'))
      return <Mail className="w-4 h-4 mr-1" />;
    return <MessageCircleMore className="w-4 h-4 mr-1" />;
  };

  return (
    <div className="flex flex-col md:flex-row bg-dozebg1 rounded-t-2xl overflow-hidden shadow-lg mb-10 border border-gray-200">
      {/* Imagen principal */}
      <div className="relative w-full md:w-[45%] h-[280px] md:h-auto">
        <Image
          src={mainImage}
          alt="Imagen principal"
          fill
          className="object-cover"
        />
        {/* Miniaturas superpuestas */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          {thumbnails.map((src, i) => (
            <button
              key={i}
              onClick={() => setMainImage(src)}
              className={`relative w-[60px] h-[45px] rounded-md overflow-hidden border-2 ${
                mainImage === src ? 'border-dozeblue' : 'border-white'
              }`}
            >
              <Image
                src={src}
                alt={`Thumb ${i}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Info derecha */}
      <div className="flex flex-col justify-between p-6 flex-1 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dozeblue">
            {property.name}
          </h1>
          <p className="text-sm text-dozegray">
            {property.address || 'Dirección no disponible'}
          </p>
          <p className="text-xs font-semibold uppercase text-dozeblue mt-1">
            {property.zone}
          </p>
          <p className="text-sm font-semibold mr-3 text-dozegray">
            Habitaciones disponibles: {roomsCount}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-xs text-dozeblue font-semibold ml-2">
              {(4).toFixed(1)}
            </span>
          </div>

          {/* Descripción */}
          <p className="mt-4 text-sm text-dozegray leading-snug line-clamp-4">
            {property.description || 'Descripción no disponible.'}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(property.communication_methods.length > 0
              ? property.communication_methods
              : ['No disponible']
            ).map((method, i) => (
              <span
                key={i}
                className="inline-flex items-center text-sm bg-white text-dozegray px-3 py-1 rounded-full border border-gray-300"
              >
                {getMethodIcon(method)}
                {method}
              </span>
            ))}
          </div>

          <div className="flex flex-col mr-2 md:items-end">
            <Link
              href={`/properties/${slugify(property.name)}`}
              className="flex justify-center items-center text-dozeblue px-4 py-2 rounded-full text-sm bg-greenlight transition mt-2 w-full sm:w-auto text-center"
            >
              Términos y Condiciones
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
