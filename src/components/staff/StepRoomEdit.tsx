'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { selectSelectedProperty } from '@/store/selectors/propertiesSelectors';
import StepRoomImage from './StepRoomImage';
import { Room } from '@/types/room';

export default function StepRoomEdit() {
  const dispatch = useDispatch();
  const property = useSelector(selectSelectedProperty);
  const [selectedRoom, setSelectedRoom] = useState<Room>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (!property) {
    }
  }, [property]);

  if (!property) return null;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-dozzze-primary">
        Editar habitaciones sincronizadas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {property.room_types.map((room) => (
          <div
            key={room.id}
            className="bg-white dark:bg-zinc-800 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col"
          >
            <div className="relative h-40 w-full">
              <Image
                src={room.images?.[0] || '/placeholder-room.jpg'}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dozzze-primary">
                  {room.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300"></p>
              </div>
              <button
                onClick={() => {
                  setSelectedRoom(room);
                  setEditModalOpen(true);
                }}
                className="mt-4 text-sm bg-dozzze-primary text-white px-3 py-2 rounded-md hover:bg-dozzze-primary/90 transition"
              >
                Editar imágenes
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <StepRoomImage
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          roomId={selectedRoom.id}
          initialImages={selectedRoom.images || []}
        />
      )}
    </div>
  );
}
