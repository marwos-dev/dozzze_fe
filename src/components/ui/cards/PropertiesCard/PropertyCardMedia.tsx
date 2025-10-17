'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

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
  const fallbackThumbnail = '/logo.png';
  const { t } = useLanguage();
  const mainAlt = String(t('propertyCard.media.mainAlt'));
  const thumbnailPrefix = String(t('propertyCard.media.thumbnailAltPrefix'));

  const fullImageList = useMemo(() => {
    const validImages = images.filter((src) => src && src.startsWith('http'));
    if (coverImage && !validImages.includes(coverImage)) {
      return [coverImage, ...validImages];
    }
    if (validImages.length === 0 && coverImage) {
      return [coverImage];
    }
    return validImages.length > 0 ? validImages : [fallbackThumbnail];
  }, [images, coverImage]);

  const thumbnails =
    fullImageList.length > 0 ? fullImageList.slice(0, 3) : [fallbackThumbnail];
  const [mainImage, setMainImage] = useState(
    fullImageList[0] || fallbackThumbnail
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

  return (
    <div className="flex flex-col w-full lg:max-w-[380px] xl:w-[320px] gap-3 lg:h-full">
      {/* Desktop */}
      <div className="hidden lg:flex gap-3 h-full">
        {/* Thumbnails */}
        <div className="flex flex-col rounded-xl gap-3 p-2 justify-start bg-[#a5b1d3] h-full min-w-[84px]">
          {thumbnails.map((src, i) => {
            const isSelected = src === mainImage;
            return (
              <button
                key={`thumb-${i}`}
                onClick={() => handleSetImage(src)}
                className={`relative w-full h-[64px] rounded-xl overflow-hidden border shadow-sm hover:scale-[1.03] transition ${
                  isSelected ? 'ring-2 ring-white' : ''
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={src || fallbackThumbnail}
                    alt={`${thumbnailPrefix} ${i + 1}`}
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
            <div className="relative w-[70px] h-[55px] rounded-xl overflow-hidden border border-white shadow-sm bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
              +{extraImagesCount}
            </div>
          )}
        </div>

        {/* Main Image */}
        <div
          onClick={handleImageClick}
          className="relative flex-1 rounded-xl overflow-hidden cursor-pointer h-full"
        >
          <div className="relative w-full h-full">
            <Image
              key={mainImage}
              src={mainImage}
              alt={mainAlt}
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
      <div className="flex lg:hidden flex-col gap-2">
        <div
          onClick={handleImageClick}
          className="relative w-full h-[200px] sm:h-[220px] rounded-xl overflow-hidden cursor-pointer"
        >
          <Image
            key={mainImage}
            src={mainImage}
            alt={mainAlt}
            fill
            sizes="100vw"
            placeholder="empty"
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        <div className="flex gap-2 p-2 rounded-xl bg-[#a5b1d3] overflow-x-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
          {thumbnails.map((src, i) => {
            const isSelected = src === mainImage;
            return (
              <button
                key={`mobile-thumb-${i}`}
                onClick={() => handleSetImage(src)}
                className={`relative w-[80px] h-[54px] rounded-xl overflow-hidden border shadow-sm hover:scale-[1.03] transition ${
                  isSelected ? 'ring-2 ring-white' : ''
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={src || fallbackThumbnail}
                    alt={`${thumbnailPrefix} ${i + 1}`}
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
