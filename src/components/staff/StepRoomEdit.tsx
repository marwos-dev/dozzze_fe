'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { AppDispatch } from '@/store';
import { getPropertyById } from '@/store/propertiesSlice';
import {
  selectSelectedProperty,
  selectPropertiesLoading,
} from '@/store/selectors/propertiesSelectors';
import StepRoomImage from './StepRoomImage';
import { RoomType } from '@/types/roomType';
import { Camera } from 'lucide-react';
import { Tooltip } from '@/components/ui/ToolTip';
import { getRoomTypeImages } from '@/services/roomApi';

interface Props {
  propertyId: number;
  onSyncComplete?: () => void;
}

export default function StepRoomEdit({ propertyId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const property = useSelector(selectSelectedProperty);
  const loading = useSelector(selectPropertiesLoading);

  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roomImagesMap, setRoomImagesMap] = useState<Record<number, string[]>>(
    {}
  );

  useEffect(() => {
    if (propertyId) {
      dispatch(getPropertyById(propertyId));
    }
  }, [propertyId, dispatch]);

  const loadImagesForRoom = async (roomId: number) => {
    try {
      const images = await getRoomTypeImages(roomId);
      setRoomImagesMap((prev) => ({
        ...prev,
        [roomId]: images,
      }));
    } catch (error) {
      console.error('Error al cargar imágenes del roomType', roomId, error);
    }
  };

  useEffect(() => {
    if (property?.room_types) {
      property.room_types.forEach((room) => {
        loadImagesForRoom(room.id);
      });
    }
  }, [property]);

  const handleImageUploaded = async (roomId: number) => {
    await loadImagesForRoom(roomId);
  };

  if (loading || !property || !property.room_types) {
    return (
      <div className="p-6 text-gray-500 text-center animate-pulse">
        Cargando habitaciones sincronizadas...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-dozzze-primary">
        Editar habitaciones sincronizadas
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {property.room_types.map((room) => (
          <div
            key={room.id}
            className="relative w-full bg-greenlight text-center shadow-xl px-2 sm:px-3 transition-all m-1 rounded-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-white/10 hover:shadow-2xl cursor-pointer"
            onClick={() => {
              setSelectedRoom(room);
              setEditModalOpen(true);
            }}
          >
            {/* Imagen principal */}
            <div className="relative w-full h-32">
              <Image
                src={
                  roomImagesMap[room.id]?.[0] || room.images?.[0] || '/logo.png'
                }
                alt={room.name}
                fill
                className="object-cover rounded-t-2xl"
                unoptimized
              />
            </div>

            {/* Mini-galería si hay más imágenes */}
            {roomImagesMap[room.id]?.length > 1 && (
              <div className="flex justify-center mt-1 gap-1 flex-wrap">
                {roomImagesMap[room.id].slice(1, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-10 h-10 rounded overflow-hidden border"
                  >
                    <Image
                      src={img}
                      alt="thumb"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {roomImagesMap[room.id].length > 4 && (
                  <div className="w-10 h-10 text-xs bg-gray-200 dark:bg-dozegray/40 text-gray-700 dark:text-white/80 rounded flex items-center justify-center">
                    +{roomImagesMap[room.id].length - 4}
                  </div>
                )}
              </div>
            )}

            {/* Nombre + botón */}
            <div className="p-3 text-sm text-dozeblue flex flex-col items-center justify-center">
              <span className="font-medium text-center break-words max-w-full leading-tight">
                {room.name}
              </span>

              <Tooltip content="Editar imágenes">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoom(room);
                    setEditModalOpen(true);
                  }}
                  className="mt-2 text-dozzze-primary hover:text-dozzze-primary/80 transition"
                >
                  <Camera size={18} />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {editModalOpen && selectedRoom && (
        <StepRoomImage
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedRoom(null);
          }}
          roomId={selectedRoom.id}
          initialImages={roomImagesMap[selectedRoom.id] || []}
          onImageUploaded={() => handleImageUploaded(selectedRoom.id)}
        />
      )}
    </div>
  );
}
