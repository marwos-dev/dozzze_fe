'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { showToast } from '@/store/toastSlice';
import { uploadRoomTypeImages } from '@/services/roomApi';

interface Props {
  open: boolean;
  onClose: () => void;
  roomId: number;
  initialImages: string[];
}

export default function StepRoomImage({
  open,
  onClose,
  roomId,
  initialImages,
}: Props) {
  const dispatch = useDispatch();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<(string | File)[]>([]);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      Promise.all(
        images.map(async (img) => {
          if (typeof img === 'string') return img;
          await uploadRoomTypeImages(roomId, img);
        })
      );

      // Acá podrías guardar las URLs si tu backend no las hace persistentes automáticamente

      dispatch(
        showToast({
          message: 'Imágenes actualizadas correctamente.',
          color: 'green',
        })
      );
      onClose();
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({ message: 'Error al guardar imágenes.', color: 'red' })
      );
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-2xl w-full shadow-lg space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-dozzze-primary">
          Editar imágenes de la habitación
        </h2>

        <button
          onClick={() => imageInputRef.current?.click()}
          className="w-full px-4 py-3 border border-dashed border-gray-400 dark:border-white/20 rounded-lg bg-gray-50 dark:bg-zinc-700 text-dozegray dark:text-white hover:bg-gray-100 transition"
        >
          Seleccionar imágenes desde tu dispositivo
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={imageInputRef}
          hidden
          onChange={handleFileSelect}
        />

        <div className="flex gap-3 overflow-x-auto py-2">
          {images.map((img, idx) => {
            const src =
              typeof img === 'string' ? img : URL.createObjectURL(img);
            return (
              <div
                key={idx}
                className="relative w-36 h-28 rounded-md overflow-hidden border border-gray-300 dark:border-white/20"
              >
                <Image
                  src={src}
                  alt={`img-${idx}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-dozzze-primary text-white px-4 py-2 rounded-md hover:bg-dozzze-primary/90 text-sm"
          >
            Guardar imágenes
          </button>
        </div>
      </div>
    </div>
  );
}
