'use client';

import Image from 'next/image';
import type { PropertyFormData } from '@/types/property';

interface Props {
  data: PropertyFormData;
  onBack: () => void;
  onSubmit: () => void;
}

export default function StepReviewAndSync({ data, onBack, onSubmit }: Props) {
  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-dozeblue">Paso 4: Revisión</h2>
      <p className="text-sm text-gray-600 dark:text-white/60">
        Revisá los datos antes de sincronizar con el sistema.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-dozeblue">Datos básicos</h3>
          <p>
            <strong>Nombre:</strong> {data.name}
          </p>
          <p>
            <strong>Dirección:</strong> {data.address}
          </p>
          <p>
            <strong>Descripción:</strong> {data.description}
          </p>
          <p>
            <strong>Zona:</strong> {data.zone}
          </p>
          <p>
            <strong>Coordenadas:</strong> {data.latitude}, {data.longitude}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-dozeblue">Imagen de portada</h3>
          {data.coverImage ? (
            <Image
              src={data.coverImage}
              alt="Imagen principal"
              width={300}
              height={200}
              className="rounded-md object-cover"
            />
          ) : (
            <p className="text-sm text-gray-500">
              No se seleccionó imagen de portada
            </p>
          )}
        </div>
      </div>

      {data.images.length > 0 && (
        <div>
          <h3 className="font-medium text-dozeblue mt-4">Galería</h3>
          <div className="flex flex-wrap gap-3">
            {data.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`Imagen ${i + 1}`}
                width={120}
                height={90}
                className="rounded-md object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="bg-gray-200 dark:bg-dozegray px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-dozegray/50 transition"
        >
          ← Volver
        </button>
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Finalizar y sincronizar
        </button>
      </div>
    </div>
  );
}
