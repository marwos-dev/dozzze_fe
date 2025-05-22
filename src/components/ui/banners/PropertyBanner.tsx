import Image from "next/image";
import { Property } from "@/types/property";

interface PropertyBannerProps {
  property: Property;
}

export default function PropertyBanner({ property }: PropertyBannerProps) {
  const images =
    property.images.length > 0 ? property.images : [property.cover_image];

  return (
    <div className="mb-8 rounded-2xl overflow-hidden shadow border border-gray-200">
      {/* Carousel minimalista */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative min-w-full h-64 md:h-96 snap-center flex-shrink-0"
          >
            <Image
              src={img}
              alt={`Imagen ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white z-10">
              <h1 className="text-2xl md:text-3xl pl-5 text-dozebg1 font-semibold">
                {property.name}
              </h1>
              <p className="text-sm pl-5 text-dozebg1 md:text-base">
                {property.address || "Dirección desconocida"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info adicional */}
      <div className="p-4 bg-greenlight">
        <p className="text-dozegray mb-3">
          {property.description || "Descripción no disponible"}
        </p>

        {/* "Badges" simples para comunicación */}
        <div className="flex flex-wrap gap-2">
          {property.communication_methods.map((method, index) => (
            <span
              key={index}
              className="text-sm bg-dozebg1 text-dozegray px-3 py-1 rounded-full border border-gray-300"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
