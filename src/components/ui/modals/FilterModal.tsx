'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function FilterModal({
  isOpen,
  onClose,
  children,
}: FilterModalProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Podés agregar header con botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-dozeblue"
        aria-label="Cerrar modal"
      >
        ✕
      </button>
      {children}
    </div>
  );
}
