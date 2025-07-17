'use client';

import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackgroundClick = () => onCancel();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white dark:bg-dozegray/90 w-full max-w-md rounded-lg p-6 shadow-lg"
        onClick={stopPropagation}
      >
        <p className="text-dozeblue mb-6 text-center">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-dozegray dark:bg-white/20 dark:text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
