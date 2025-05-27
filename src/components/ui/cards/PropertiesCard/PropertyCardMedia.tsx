"use client";

import Image from "next/image";
import { useState } from "react";

interface PropertyCardMediaProps {
  images: string[];
  coverImage?: string;
  onImageClick?: (index: number) => void;
}

export default function PropertyCardMedia({
  images,
  coverImage,
  onImageClick,
}: PropertyCardMediaProps) {
  const thumbnails = images.slice(0, 4);
  const [mainImage, setMainImage] = useState(coverImage || thumbnails[0]);
  const extraImagesCount = images.length - thumbnails.length;

  const mainImageIndex = images.indexOf(mainImage);

  return (
    <div className="flex flex-col w-full md:w-[320px] gap-2">
      {/* Desktop */}
      <div className="hidden md:flex gap-2 h-full">
        <div className="flex flex-col gap-2">
          {thumbnails.map((src, i) => (
            <button
              key={i}
              onClick={() => {
                setMainImage(src);
                if (onImageClick) onImageClick(images.indexOf(src));
              }}
              className={`relative w-[70px] h-[48px] rounded-xl overflow-hidden border shadow-sm hover:scale-[1.03] transition`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="70px"
                className="object-cover"
              />
            </button>
          ))}
          {extraImagesCount > 0 && (
            <div className="relative w-[70px] h-[48px] rounded-xl overflow-hidden border border-white shadow-sm bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
              +{extraImagesCount}
            </div>
          )}
        </div>
        <div
          onClick={() => onImageClick && onImageClick(mainImageIndex)}
          className="relative flex-1 rounded-xl overflow-hidden h-[220px] cursor-pointer"
        >
          <Image
            src={mainImage}
            alt="Main image"
            fill
            sizes="(max-width: 768px) 100vw, 330px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-2">
        <div
          onClick={() => onImageClick && onImageClick(mainImageIndex)}
          className="relative w-full h-[180px] rounded-xl overflow-hidden cursor-pointer"
        >
          <Image src={mainImage} alt="Main image" fill className="object-cover" />
        </div>
        <div className="flex gap-2">
          {thumbnails.map((src, i) => (
            <button
              key={i}
              onClick={() => {
                setMainImage(src);
                if (onImageClick) onImageClick(images.indexOf(src));
              }}
              className={`relative w-[80px] h-[54px] rounded-xl overflow-hidden border shadow-sm hover:scale-[1.03] transition
                ${
                  mainImage === src
                    ? "border-blue-500 ring-2 ring-blue-400"
                    : "border-white"
                }
              `}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
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
