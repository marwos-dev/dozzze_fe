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

  useEffect(() => {
    if (propertyId) {
      dispatch(getPropertyById(propertyId));
    }
  }, [propertyId, dispatch]);

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
            <div className="relative w-full h-32">
              <Image
                src={room.images?.[0] || '/logo.png'}
                alt={room.name}
                fill
                className="object-cover rounded-t-2xl"
              />
            </div>

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
          initialImages={selectedRoom.images || []}
        />
      )}
    </div>
  );
}
