'use client';
import { X } from 'lucide-react';
import Seeker from '@/components/sections/Seeker';

export default function FilterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header del modal */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-dozeblue">
          Buscar alojamiento
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-dozeblue"
          aria-label="Cerrar modal"
        >
          <X size={28} />
        </button>
      </div>

      {/* Contenido del Seeker */}
      <div className="flex-1 overflow-y-auto p-4">
        <Seeker initialFilterOpen={true} />{' '}
      </div>
    </div>
  );
}
