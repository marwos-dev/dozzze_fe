'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createProperty, uploadPropertyImage } from '@/services/propertiesApi';
import type { PropertyFormData } from '@/types/property';
import { showToast } from '@/store/toastSlice';
import { useDispatch } from 'react-redux';
import { addPropertyToZone } from '@/store/zoneSlice';
import { addMyProperty } from '@/store/propertiesSlice';

interface Props {
  data: PropertyFormData;
  onBack: () => void;
  onSubmit: (propertyId: number) => void;
}

export default function StepCreateProperty({ data, onBack, onSubmit }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    data.images.map((img) =>
      typeof img === 'string' ? img : URL.createObjectURL(img)
    )
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Crear propiedad
      const payload = {
        name: data.name,
        description: data.description,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        zone_id: data.zone_id,
        pms_id: data.pms_id,
        images: data.images.filter(
          (img): img is string => typeof img === 'string'
        ),
        coverImage: data.coverImage,
        zone: data.zone,
      };

      const created = await createProperty(payload);

      if (!created?.id) {
        dispatch(
          showToast({
            message: 'No se pudo obtener el ID de la propiedad',
            color: 'red',
          })
        );
        return;
      }

      // ✅ 2. Agregar propiedad al Redux (zonesSlice)
      dispatch(addPropertyToZone(created));
      dispatch(addMyProperty(created));

      // 3. Subir imágenes tipo File
      const newImages = data.images.filter(
        (img): img is File => img instanceof File
      );
      if (newImages.length > 0) {
        setUploadingImages(true);
        await Promise.all(
          newImages.map((file) => uploadPropertyImage(created.id, file))
        );
        setUploadingImages(false);
      }

      dispatch(
        showToast({
          message: 'Propiedad creada correctamente',
          color: 'green',
        })
      );

      setPreviewUrls([]);
      onSubmit(created.id);
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({ message: 'Error al crear la propiedad', color: 'red' })
      );
    } finally {
      setLoading(false);
      setUploadingImages(false);
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
          {data.images.map((img, idx) => {
            const src = typeof img === 'string' ? img : previewUrls[idx];
            if (!src) return null;
            return (
              <Image
                key={idx}
                src={src}
                alt={`img-${idx}`}
                width={120}
                height={80}
                className="rounded object-cover border"
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-start md:flex-row md:items-center justify-between pt-4 gap-3">
        <button
          onClick={onBack}
          className="bg-gray-200 dark:bg-dozegray px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-dozegray/50 transition"
        >
          Volver
        </button>

        <div className="flex flex-col items-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Crear propiedad'}
          </button>

          {uploadingImages && (
            <span className="text-sm mt-2 text-gray-500 animate-pulse">
              Guardando las imágenes, esto tomará un momento...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
