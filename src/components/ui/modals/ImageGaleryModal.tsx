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

  const currentImage =
    typeof images[index] === 'string' && images[index].startsWith('http')
      ? images[index]
      : '/logo.png';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl h-[70vh] px-6">
        {!currentImage ? (
          <div className="w-full h-full flex items-center justify-center text-white">
            Imagen no disponible
          </div>
        ) : (
          <Image
            key={currentImage}
            src={currentImage}
            alt={`Imagen ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
            unoptimized
            priority
          />
        )}
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

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-6">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`relative w-20 h-14 flex-shrink-0 rounded-md overflow-hidden border ${i === index ? 'border-dozeblue ring-2 ring-dozeblue' : 'border-transparent'}`}
          >
            <Image
              src={typeof img === 'string' ? img : '/logo.png'}
              alt={`Miniatura ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
}
