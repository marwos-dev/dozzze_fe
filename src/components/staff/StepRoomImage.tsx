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
import { useLanguage } from '@/i18n/LanguageContext';

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
  const [syncingServiceId, setSyncingServiceId] = useState<number | null>(null);
  const { t } = useLanguage();

  const loadRoomServices = async () => {
    try {
      const services = await getRoomTypeServices(roomId);
      setRoomServices(services);
    } catch (err) {
      console.error(err);
    }
  };

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
      setSyncingServiceId(svc.id);
      if (exists) {
        const toDelete = roomServices.find((s) => s.id === svc.id);
        if (toDelete) {
          await deleteRoomTypeService(roomId, toDelete.id);
          await loadRoomServices();
          dispatch(
            showToast({
              message: t('staff.stepRoomImage.serviceRemoved') as string,
              color: 'green',
            })
          );
        }
      } else {
        await addRoomTypeService(roomId, {
          code: svc.code,
          name: svc.name,
          description: svc.description,
        });
        await loadRoomServices();
        dispatch(
          showToast({
            message: t('staff.stepRoomImage.serviceAdded') as string,
            color: 'green',
          })
        );
      }
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          message: t('staff.stepRoomImage.updateError') as string,
          color: 'red',
        })
      );
    } finally {
      setSyncingServiceId(null);
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
        showToast({
          message: t('staff.stepRoomImage.uploadSuccess') as string,
          color: 'green',
        })
      );
      if (onImageUploaded) {
        await onImageUploaded();
      }
      onClose();
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          message: t('staff.stepRoomImage.uploadError') as string,
          color: 'red',
        })
      );
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
          {t('staff.stepRoomImage.modalTitle')}
        </h2>

        <div>
          <label className="block text-sm font-medium text-dozegray dark:text-white/80">
            {t('staff.stepRoomImage.descriptionLabel')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder={t('staff.stepRoomImage.descriptionPlaceholder') as string}
            disabled
            className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-dozzegray/20 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dozegray dark:text-white/80">
            {t('staff.stepRoomImage.servicesLabel')}
          </label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {propertyServices.length === 0 && (
              <p className="text-sm text-gray-500">
                {t('staff.stepRoomImage.noServices')}
              </p>
            )}
            {propertyServices.map((svc) => (
              <label
                key={svc.id}
                className={`flex items-center gap-2 select-none ${
                  syncingServiceId === svc.id
                    ? 'cursor-not-allowed opacity-70'
                    : 'cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  checked={roomServices.some((s) => s.id === svc.id)}
                  onChange={() => handleToggleService(svc)}
                  disabled={syncingServiceId === svc.id}
                  className="sr-only peer"
                />
                <span
                  className="h-5 w-5 flex items-center justify-center border border-gray-300 rounded peer-checked:bg-dozeblue peer-checked:border-dozeblue peer-disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-white hidden peer-checked:block" />
                </span>
                <span className="text-sm">{svc.name}</span>
              </label>
            ))}
          </div>
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
              {t('staff.stepRoomImage.noImages')}
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
            <Plus size={18} /> {t('staff.stepRoomImage.uploadButton')}
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
              {t('staff.stepRoomImage.previewLabel')}
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
                  <p className="text-sm">
                    {t('staff.stepRoomImage.uploading')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
