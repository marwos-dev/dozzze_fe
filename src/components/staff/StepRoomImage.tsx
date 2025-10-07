'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { showToast } from '@/store/toastSlice';
import {
  uploadRoomTypeImages,
  getRoomTypeServices,
  addRoomTypeService,
  deleteRoomTypeService,
} from '@/services/roomApi';
import { getPropertyServices } from '@/services/propertiesApi';
import type { PropertyService } from '@/types/property';
import { Plus, X, Loader2, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const SERVICES_PREVIEW_COUNT = 8;

interface Props {
  open: boolean;
  onClose: () => void;
  roomId: number;
  propertyId: number;
  initialImages: string[];
  onImageUploaded?: () => void;
}

export default function StepRoomImage({
  open,
  onClose,
  roomId,
  propertyId,
  initialImages,
  onImageUploaded,
}: Props) {
  const dispatch = useDispatch();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [propertyServices, setPropertyServices] = useState<PropertyService[]>([]);
  const [roomServices, setRoomServices] = useState<PropertyService[]>([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const visibleServices = showAllServices
    ? propertyServices
    : propertyServices.slice(0, SERVICES_PREVIEW_COUNT);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const [propSvcs, roomSvcs] = await Promise.all([
          getPropertyServices(propertyId),
          getRoomTypeServices(roomId),
        ]);
        setPropertyServices(propSvcs);
        setRoomServices(roomSvcs);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [open, propertyId, roomId]);

  const handleToggleService = async (svc: PropertyService) => {
    const exists = roomServices.some((s) => s.id === svc.id);
    try {
      if (exists) {
        const toDelete = roomServices.find((s) => s.id === svc.id);
        if (toDelete) {
          await deleteRoomTypeService(roomId, toDelete.id);
          setRoomServices((prev) => prev.filter((s) => s.id !== toDelete.id));
        }
      } else {
        const created = await addRoomTypeService(roomId, {
          code: svc.code,
          name: svc.name,
          description: svc.description,
        });
        setRoomServices((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({ message: 'Error al actualizar servicio', color: 'red' })
      );
    }
  };

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

        <div>
          <label className="block text-sm font-medium text-dozegray dark:text-white/80">
            Servicios disponibles
          </label>
          <motion.div layout className="mt-2 flex flex-wrap gap-2">
            {propertyServices.length === 0 && (
              <p className="text-sm text-gray-500">No hay servicios registrados.</p>
            )}
            <AnimatePresence initial={false} mode="popLayout">
              {visibleServices.map((svc) => (
                <motion.label
                  key={svc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={roomServices.some((s) => s.id === svc.id)}
                    onChange={() => handleToggleService(svc)}
                    className="sr-only peer"
                  />
                  <span
                    className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-dozeblue/30 bg-white text-sm font-medium text-dozeblue dark:bg-dozzegray/60 dark:text-dozeblue transition-all duration-200 shadow-sm hover:border-dozeblue hover:shadow-md focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-dozeblue/40 peer-checked:bg-dozeblue peer-checked:text-white peer-checked:border-dozeblue"
                  >
                    <Check className="hidden w-4 h-4 transition-transform duration-200 text-white peer-checked:block" />
                    <span className="leading-none text-center text-current">{svc.name}</span>
                  </span>
                </motion.label>
              ))}
            </AnimatePresence>
          </motion.div>
          {propertyServices.length > SERVICES_PREVIEW_COUNT && (
            <div className="mt-3 flex justify-center">
              <motion.button
                type="button"
                onClick={() => setShowAllServices((prev) => !prev)}
                className="text-sm font-medium text-dozeblue hover:text-dozeblue/80 transition-colors"
                aria-expanded={showAllServices}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                {showAllServices ? 'Ver menos' : 'Ver más'}
              </motion.button>
            </div>
          )}
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
