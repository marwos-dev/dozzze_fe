'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PropertyCardMediaProps {
  images?: string[];
  coverImage?: string;
  onImageClick?: (index: number) => void;
}

export default function PropertyCardMedia({
  images = [],
  coverImage,
  onImageClick,
}: PropertyCardMediaProps) {
  const hasImages = images.length > 0;
  const thumbnails = hasImages ? images.slice(0, 4) : ['/logo.png'];
  const [mainImage, setMainImage] = useState(
    coverImage || thumbnails[0] || '/logo.png'
  );
  const extraImagesCount = hasImages ? images.length - thumbnails.length : 0;

  const validIndex = Math.max(
    images.findIndex((img) => img === mainImage),
    0
  );

  return (
    <div className="flex flex-col w-full md:w-[330px] gap-2 md:h-full">
      {/* Desktop */}
      <div className="hidden md:flex gap-2 h-full">
        {/* Thumbnails */}
        <div
          style={{ backgroundColor: '#a5b1d3' }}
          className="flex flex-col rounded-xl gap-2 p-2 justify-start"
        >
          {thumbnails.map((src, i) => {
            const isSelected = src === mainImage;
            return (
              <button
                key={i}
                onClick={() => setMainImage(src)}
                className={`relative w-[70px] h-[55px] rounded-xl overflow-hidden border shadow-sm hover:scale-[1.03] transition ${
                  isSelected ? 'ring-2 ring-white' : ''
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="70px"
                  className="object-cover"
                />
              </button>
            );
          })}
          {extraImagesCount > 0 && (
            <div className="relative w-[70px] h-[55px] rounded-xl overflow-hidden border border-white shadow-sm bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
              +{extraImagesCount}
            </div>
          )}
        </div>

        {/* Main Image */}
        <div
          onClick={() => onImageClick && hasImages && onImageClick(validIndex)}
          className="relative flex-1 rounded-xl overflow-hidden cursor-pointer"
        >
          <Image
            src={mainImage}
            alt="Main image"
            fill
            sizes="(max-width: 768px) 130vw, 330px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-2">
        <div
          onClick={() => onImageClick && hasImages && onImageClick(validIndex)}
          className="relative w-full h-[180px] rounded-xl overflow-hidden cursor-pointer"
        >
          <Image
            src={mainImage}
            alt="Main image"
            fill
            className="object-cover"
          />
        </div>
        <div
          style={{ backgroundColor: '#a5b1d3' }}
          className="flex gap-2 p-2 rounded-xl"
        >
          {thumbnails.map((src, i) => {
            const isSelected = src === mainImage;
            return (
              <button
                key={i}
                onClick={() => setMainImage(src)}
                className={`relative w-[80px] h-[54px] rounded-xl overflow-hidden border shadow-sm hover:scale-[1.03] transition ${
                  isSelected ? 'ring-2 ring-white' : ''
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
          {extraImagesCount > 0 && (
            <div className="relative w-[80px] h-[54px] rounded-xl overflow-hidden border border-white shadow-sm bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
              +{extraImagesCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
