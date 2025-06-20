'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';

interface PropertyCardMediaProps {
  images?: string[];
  coverImage?: string;
  onImageClick?: (index: number, imageList: string[]) => void;
}

export default function PropertyCardMedia({
  images = [],
  coverImage,
  onImageClick,
}: PropertyCardMediaProps) {
  const hasImages = images.length > 0;

  const fullImageList = useMemo(() => {
    if (!hasImages && coverImage) return [coverImage];
    if (coverImage && !images.includes(coverImage))
      return [coverImage, ...images];
    return images;
  }, [images, coverImage]);

  const thumbnails = fullImageList.slice(0, 4);
  const [mainImage, setMainImage] = useState(
    coverImage || thumbnails[0] || '/logo.png'
  );

  const extraImagesCount =
    fullImageList.length > 4 ? fullImageList.length - thumbnails.length : 0;

  const validIndex = fullImageList.findIndex((img) => img === mainImage);

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
          onClick={() =>
            onImageClick &&
            fullImageList.length > 0 &&
            onImageClick(validIndex, fullImageList)
          }
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
          onClick={() =>
            onImageClick &&
            fullImageList.length > 0 &&
            onImageClick(validIndex, fullImageList)
          }
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
