'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPropertyById } from '@/store/propertiesSlice';
import { selectSelectedProperty } from '@/store/selectors/propertiesSelectors';
import { AppDispatch } from '@/store';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 🔹 COMPONENTES UI EMBEBIDOS ---------------------

function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      <div className="relative z-60" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function DialogContent({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl shadow-lg w-full max-w-lg ${className}`}>
      {children}
    </div>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-dozzze-primary ${className}`}
    />
  );
}

function Button({
  children,
  onClick,
  variant = 'default',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'ghost';
}) {
  const base = 'px-4 py-2 rounded-md font-medium text-sm transition-all';
  const variants = {
    default: 'bg-dozzze-primary text-white hover:bg-dozzze-primary/90',
    ghost:
      'bg-transparent text-gray-700 dark:text-white border border-gray-300 dark:border-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-700',
  };
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}

// 🔹 COMPONENTE PRINCIPAL -------------------------

interface Props {
  propertyId: number;
}

export default function StepRoomEdit({ propertyId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const property = useSelector(selectSelectedProperty);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [roomDescription, setRoomDescription] = useState('');

  useEffect(() => {
    dispatch(getPropertyById(propertyId));
  }, [dispatch, propertyId]);

  const selectedRoom =
    property?.room_types?.find((r) => r.id === selectedRoomId) || null;

  useEffect(() => {
    if (selectedRoom) {
      setRoomImages(selectedRoom.images || []);
      setRoomDescription(selectedRoom.description || '');
    }
  }, [selectedRoom]);

  const handleSave = () => {
    console.log('Guardar:', {
      id: selectedRoomId,
      images: roomImages,
      description: roomDescription,
    });
    setSelectedRoomId(null);
  };

  if (!property) {
    return (
      <div className="text-center text-red-500">Cargando propiedad...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-4">
      <h2 className="text-2xl font-semibold text-dozzze-primary">
        Editar habitaciones
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Selecciona una habitación para editar su descripción e imágenes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {property.room_types?.map((room) => (
          <motion.div
            key={room.id}
            whileHover={{ scale: 1.02 }}
            className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zinc-900 cursor-pointer"
            onClick={() => setSelectedRoomId(room.id)}
          >
            <h3 className="text-lg font-medium">{room.name}</h3>
            <p className="text-sm text-gray-500">
              {room.description || 'Sin descripción'}
            </p>
            {room.images?.[0] && (
              <Image
                src={room.images[0]}
                alt="Imagen de habitación"
                width={400}
                height={300}
                className="rounded-lg mt-2 object-cover aspect-video"
              />
            )}
          </motion.div>
        ))}
      </div>

      <Dialog
        open={selectedRoomId !== null}
        onOpenChange={() => setSelectedRoomId(null)}
      >
        <DialogContent className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md p-6 border-dozzze-primary border-2">
          <h3 className="text-xl font-semibold mb-4 text-dozzze-primary">
            Editar habitación
          </h3>

          <Textarea
            placeholder="Descripción"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
            className="mb-4"
          />

          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              URLs de imágenes (una por línea)
            </label>
            <Textarea
              rows={4}
              value={roomImages.join('\n')}
              onChange={(e) =>
                setRoomImages(
                  e.target.value.split('\n').map((line) => line.trim())
                )
              }
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setSelectedRoomId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
