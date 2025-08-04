'use client';

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { showToast } from '@/store/toastSlice';
import { uploadRoomTypeImages } from '@/services/roomApi';
import { Plus, X, Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  roomId: number;
  initialImages: string[];
  onImageUploaded?: () => void;
}

export default function StepRoomImage({
  open,
  onClose,
  roomId,
  initialImages,
  onImageUploaded,
}: Props) {
  const dispatch = useDispatch();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImage(file);
    await handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      await uploadRoomTypeImages(roomId, file);
      dispatch(
        showToast({ message: 'Imagen subida con éxito', color: 'green' })
      );
      if (onImageUploaded) {
        await onImageUploaded();
      }
      onClose();
    } catch (err) {
      console.error(err);
      dispatch(showToast({ message: 'Error al subir imagen', color: 'red' }));
    } finally {
      setLoading(false);
      setPreviewImage(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-greenlight rounded-xl p-6 w-full max-w-2xl shadow-xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-dozeblue hover:text-dozeblue/80 transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-dozeblue text-center">
          Galería de imágenes
        </h2>

        <div>
          <label className="block text-sm font-medium text-dozegray dark:text-white/80">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Descripción"
            disabled
            className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-dozzegray/20 text-gray-500"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {initialImages.length > 0 ? (
            initialImages.map((url, idx) => (
              <div
                key={idx}
                className="relative w-full h-28 sm:h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10"
              >
                <Image
                  src={url}
                  alt={`Imagen ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="text-gray-500 col-span-full text-center">
              No hay imágenes aún.
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-dozeblue text-white rounded-md hover:bg-dozeblue/90 transition disabled:opacity-50"
          >
            <Plus size={18} /> Subir nueva imagen
          </button>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInputRef}
            onChange={handleSelectFile}
          />
        </div>

        {previewImage && (
          <div className="text-center relative">
            <p className="text-sm text-gray-600 dark:text-white/70 mb-2">
              Vista previa:
            </p>
            <div className="relative w-full h-40 sm:h-56 mx-auto border rounded-lg overflow-hidden">
              <Image
                src={URL.createObjectURL(previewImage)}
                alt="preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
              {loading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white space-y-2">
                  <Loader2 className="animate-spin w-6 h-6" />
                  <p className="text-sm">Subiendo imagen...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
