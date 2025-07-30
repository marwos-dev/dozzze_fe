'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createProperty } from '@/services/propertiesApi';
import type { PropertyFormData } from '@/types/property';
import { showToast } from '@/store/toastSlice';
import { useDispatch } from 'react-redux';

interface Props {
  data: PropertyFormData;
  onBack: () => void;
  onSubmit: () => void;
}

export default function StepCreateProperty({ data, onBack, onSubmit }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        name: data.name,
        description: data.description,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        zone_id: data.zone_id,
        images: data.images,
        coverImage: data.coverImage,
        zone: data.zone,
      };
      await createProperty(payload);
      dispatch(
        showToast({ message: 'Propiedad creada correctamente', color: 'green' })
      );
      onSubmit();
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({ message: 'Error al crear la propiedad', color: 'red' })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-dozeblue">
        Paso 4: Sincronización
      </h2>
      <p className="text-sm text-gray-600 dark:text-white/60">
        Revisá los datos antes de enviar la propiedad al sistema.
      </p>

      <div className="space-y-2">
        <div>
          <strong>Nombre:</strong> {data.name}
        </div>
        <div>
          <strong>Dirección:</strong> {data.address}
        </div>
        <div>
          <strong>Descripción:</strong> {data.description}
        </div>
        <div>
          <strong>Zona:</strong> {data.zone}
        </div>
        <div>
          <strong>Coordenadas:</strong> {data.latitude}, {data.longitude}
        </div>
      </div>

      <div>
        <strong>Imágenes:</strong>
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {data.images.map((url, idx) => (
            <Image
              key={idx}
              src={url}
              alt={`img-${idx}`}
              width={120}
              height={80}
              className="rounded object-cover border"
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="bg-gray-200 dark:bg-dozegray px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-dozegray/50 transition"
        >
          Volver
        </button>

        <button
          onClick={handleSubmit}
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Crear propiedad'}
        </button>
      </div>
    </div>
  );
}
