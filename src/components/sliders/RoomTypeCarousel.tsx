'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { RoomType } from '@/types/roomType';

interface Props {
  roomTypes: RoomType[];
}

export default function RoomTypeCarousel({ roomTypes }: Props) {
  const slides = roomTypes.flatMap((rt) =>
    (rt.images ?? []).map((img) => ({ img, name: rt.name }))
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const prev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () =>
    setIndex((prev) => (prev + 1) % slides.length);

  const current = slides[index];
  const src =
    typeof current.img === 'string' && current.img.startsWith('http')
      ? current.img
      : '/logo.png';

  return (
    <div className="relative w-full h-64 sm:h-72 md:h-80 mb-6 rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={`Habitación ${current.name}`}
        fill
        priority
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 66vw"
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-black/40 text-center text-white text-sm py-1">
        {current.name}
      </div>
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-dozeblue rounded-full w-8 h-8 flex items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-dozeblue rounded-full w-8 h-8 flex items-center justify-center"
      >
        ›
      </button>
    </div>
  );
}
