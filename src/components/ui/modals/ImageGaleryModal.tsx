'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageGalleryModal({
  images,
  initialIndex = 0,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);

  const showPrev = useCallback(
    () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)),
    [images.length]
  );

  const showNext = useCallback(
    () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)),
    [images.length]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    },
    [onClose, showNext, showPrev]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [handleKeyDown]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl h-[80vh] px-6">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`Imagen ${index + 1}`}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      <button
        onClick={showPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={showNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-red-400"
      >
        <X className="w-8 h-8" />
      </button>
    </div>
  );
}
