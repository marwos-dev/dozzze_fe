"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/images/Homesection/img1.jpg",
  "/images/Homesection/img2.jpg",
  "/images/Homesection/img3.jpg",
];

export default function HomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-xl h-[400px] sm:h-[500px] mx-auto overflow-hidden rounded-3xl">
      {/* Overlay para oscurecer levemente el fondo */}
      <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none rounded-3xl" />

      {/* Imágenes */}
      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((src, index) => {
          const isActive = index === currentIndex;
          const isPrev =
            index === (currentIndex - 1 + images.length) % images.length;
          const isNext = index === (currentIndex + 1) % images.length;

          const baseClass =
            "absolute transition-all duration-700 ease-in-out rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden";

          const className = isActive
            ? `${baseClass} w-full h-full z-30 scale-100 opacity-100 blur-0`
            : isPrev || isNext
              ? `${baseClass} w-3/4 h-4/5 z-20 scale-90 opacity-60 blur-sm ${isPrev ? "-translate-x-1/2 left-0" : "translate-x-1/2 right-0"
              }`
              : "hidden";

          return (
            <div className={className} key={index}>
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover rounded-3xl"
                priority={isActive}
              />
            </div>
          );
        })}
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/30 hover:bg-white/70 text-[#1E3A8A] text-3xl px-3 py-1 rounded-full shadow-md transition"
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/30 hover:bg-white/70 text-[#1E3A8A] text-3xl px-3 py-1 rounded-full shadow-md transition"
      >
        ›
      </button>
    </div>
  );
}
