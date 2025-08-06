'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Trash2, Plus } from 'lucide-react';
import type { PropertyFormData } from '@/types/property';

interface Props {
  form: PropertyFormData;
  setForm: React.Dispatch<React.SetStateAction<PropertyFormData>>;
}

export default function StepImages({ form, setForm }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDeleteImage = (index: number) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);

      return {
        ...prev,
        images: newImages,
        // Si se borra la portada, quitarla si coincidía
        coverImage:
          typeof prev.coverImage === 'string' &&
          prev.coverImage === newImages[index]
            ? ''
            : prev.coverImage,
      };
    });
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    }
  };

  const getImageUrl = (img: string | File): string =>
    typeof img === 'string' ? img : URL.createObjectURL(img);

  return (
    <div className="space-y-4">
      {/* Botón de agregar imágenes */}
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-400 rounded-md bg-white hover:bg-gray-100 text-dozegray transition"
        >
          <Plus size={16} />
          Agregar imagen
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAddImages}
          ref={inputRef}
          hidden
        />
      </div>

      {/* Galería de imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {form.images.map((img, index) => (
          <div
            key={index}
            className="relative rounded-md overflow-hidden border group"
          >
            <Image
              src={getImageUrl(img)}
              alt={`img-${index}`}
              width={300}
              height={200}
              className="object-cover w-full h-40"
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(index)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
