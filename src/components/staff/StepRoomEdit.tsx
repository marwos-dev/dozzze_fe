'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { fetchRooms } from '@/store/roomsSlice';
import { getRoomTypeImages } from '@/services/roomApi';
import { Room } from '@/types/room';
import StepRoomImage from './StepRoomImage';
import { Camera } from 'lucide-react';
import { Tooltip } from '@/components/ui/ToolTip';

interface Props {
  propertyId: number;
}

export default function StepRoomEdit({ propertyId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const roomTypes = useSelector(
    (state: RootState) => state.rooms.roomsByProperty[propertyId]
  );
  const loading = useSelector((state: RootState) => state.rooms.loading);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roomImagesMap, setRoomImagesMap] = useState<Record<number, string[]>>(
    {}
  );

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchRooms({ propertyId }));
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
    if (roomTypes) {
      roomTypes.forEach((room) => {
        loadImagesForRoom(room.id);
      });
    }
  }, [roomTypes]);

  const handleImageUploaded = async (roomId: number) => {
    await loadImagesForRoom(roomId);
  };

  if (loading || !roomTypes) {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
        {roomTypes.map((room) => (
          <div
            key={room.id}
            className="relative w-full bg-greenlight text-center shadow-xl px-2 sm:px-3 transition-all rounded-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-white/10 hover:shadow-2xl cursor-pointer min-h-[260px]"
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

            {/* Galería de thumbnails */}
            {roomImagesMap[room.id]?.length > 1 && (
              <div className="flex justify-center mt-1 gap-1 flex-wrap h-fit">
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

            {/* Nombre y botón */}
            <div className="p-3 text-sm text-dozeblue flex flex-col items-center justify-center flex-1">
              <span className="font-medium text-center break-words leading-tight w-full">
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
          propertyId={propertyId}
          initialImages={roomImagesMap[selectedRoom.id] || []}
          onImageUploaded={() => handleImageUploaded(selectedRoom.id)}
        />
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={() => router.push('/staff')}
          className="bg-dozeblue text-white px-6 py-2 rounded-md hover:bg-dozeblue/90 transition"
        >
          Finalizar configuración
        </button>
      </div>
    </div>
  );
}
