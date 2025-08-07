'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { PropertyFormData } from '@/types/property';
import { uploadPropertyImage } from '@/services/propertiesApi';
import { useDispatch } from 'react-redux';
import { showToast } from '@/store/toastSlice';
import { Loader2 } from 'lucide-react';

interface Props {
  form: PropertyFormData;
  setForm: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  propertyId: number;
}

export default function StepImages({ form, setForm, propertyId }: Props) {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([]);

  useEffect(() => {
    const urls = form.images.map((img) =>
      typeof img === 'string' ? img : URL.createObjectURL(img)
    );
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [form.images]);

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviewIndexes = files.map((_, i) => form.images.length + i);
    setUploadingIndexes((prev) => [...prev, ...newPreviewIndexes]);

    for (const [i, file] of files.entries()) {
      const index = form.images.length + i;

      try {
        await uploadPropertyImage(propertyId, file);

        const imageUrl = URL.createObjectURL(file);
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));

        dispatch(
          showToast({ message: 'Imagen subida con éxito', color: 'green' })
        );
      } catch {
        dispatch(showToast({ message: 'Error al subir imagen', color: 'red' }));
      } finally {
        setUploadingIndexes((prev) => prev.filter((idx) => idx !== index));
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white dark:bg-dozegray/10 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-dozeblue">
        Paso 3: Imágenes de la propiedad
      </h2>

      {/* Galería de imágenes */}
      {previewUrls.length > 0 && (
        <div className="overflow-x-auto -mx-1">
          <div className="flex gap-3 min-w-full max-w-full px-1">
            {previewUrls.map((url, index) => {
              const isLoading = uploadingIndexes.includes(index);
              return (
                <div
                  key={index}
                  className="relative h-28 w-36 rounded-lg overflow-hidden border border-gray-300 dark:border-white/20 shrink-0 group bg-gray-100 dark:bg-dozegray/20"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full w-full">
                      <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <Image
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs group-hover:opacity-100 opacity-0 transition"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón de añadir imágenes */}
      <div>
        <label className="block text-sm font-medium text-dozegray dark:text-white/80 mb-1">
          Añadir más imágenes
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingIndexes.length > 0}
          className="w-full px-4 py-3 text-center border border-dashed border-gray-400 dark:border-white/20 rounded-lg bg-gray-50 dark:bg-dozegray/20 text-dozegray dark:text-white/80 hover:bg-gray-100 transition disabled:opacity-50"
        >
          {uploadingIndexes.length > 0
            ? 'Subiendo imágenes...'
            : 'Elegir imágenes desde tu dispositivo'}
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleAddImages}
        />
      </div>
    </div>
  );
}
