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
  const fullImageList = useMemo(() => {
    const hasImgs = images.length > 0;

    if (!hasImgs && coverImage) return [coverImage];
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

  const handleImageClick = () => {
    if (onImageClick && fullImageList.length > 0) {
      onImageClick(validIndex, fullImageList);
    }
  };

  const handleSetImage = (src: string) => {
    if (src !== mainImage) setMainImage(src);
  };

  const getSafeSrc = (src: string | undefined) =>
    typeof src === 'string' && src.trim().length > 10 && src.startsWith('http')
      ? src
      : '/logo.png';

  return (
    <div className="flex flex-col w-full md:w-[330px] gap-2 md:h-full">
      {/* Desktop */}
      <div className="hidden md:flex gap-2 h-full">
        {/* Thumbnails */}
        <div className="flex flex-col rounded-xl gap-2 p-2 justify-start bg-[#a5b1d3]">
          {thumbnails.map((src, i) => {
            const safeSrc = getSafeSrc(src);
            const isSelected = safeSrc === mainImage;
            return (
              <button
                key={`thumb-${i}`}
                onClick={() => handleSetImage(safeSrc)}
                className={`relative w-[70px] h-[55px] rounded-xl overflow-hidden border shadow-sm hover:scale-[1.03] transition ${
                  isSelected ? 'ring-2 ring-white' : ''
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    key={safeSrc}
                    src={safeSrc}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="70px"
                    placeholder="empty"
                    className="object-cover"
                    unoptimized
                  />
                </div>
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
          onClick={handleImageClick}
          className="relative flex-1 rounded-xl overflow-hidden cursor-pointer"
        >
          <div className="relative w-full h-full">
            <Image
              key={mainImage}
              src={getSafeSrc(mainImage)}
              alt="Main image"
              fill
              sizes="(max-width: 768px) 100vw, 330px"
              placeholder="empty"
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-2">
        <div
          onClick={handleImageClick}
          className="relative w-full h-[180px] rounded-xl overflow-hidden cursor-pointer"
        >
          <Image
            key={mainImage}
            src={getSafeSrc(mainImage)}
            alt="Main image"
            fill
            sizes="100vw"
            placeholder="empty"
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        <div className="flex gap-2 p-2 rounded-xl bg-[#a5b1d3]">
          {thumbnails.map((src, i) => {
            const safeSrc = getSafeSrc(src);
            const isSelected = safeSrc === mainImage;
            return (
              <button
                key={`mobile-thumb-${i}`}
                onClick={() => handleSetImage(safeSrc)}
                className={`relative w-[80px] h-[54px] rounded-xl overflow-hidden border shadow-sm hover:scale-[1.03] transition ${
                  isSelected ? 'ring-2 ring-white' : ''
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    key={safeSrc}
                    src={safeSrc}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="80px"
                    placeholder="empty"
                    className="object-cover"
                    unoptimized
                  />
                </div>
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
