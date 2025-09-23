'use client';

import { ArrowDown } from 'lucide-react';
import { MouseEventHandler, TouchEventHandler } from 'react';

interface AnimatedButtonProps {
  text: string | string[];
  sectionId: string; // ej: "#zones"
  className?: string;
  offset?: number; // alto fijo a restar (header, pill, etc.)
}

const AnimatedButton = ({
  text,
  sectionId,
  className = '',
  offset = 120, // ajustá a tu layout (≈ header + pill)
}: AnimatedButtonProps) => {
  const content = Array.isArray(text) ? text.join(' ') : text;

  const scrollToSection = () => {
    const el = document.querySelector(sectionId) as HTMLElement | null;
    if (!el) return;

    const go = () => {
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

    // Primer scroll
    go();
    // Segundo scroll en el próximo frame por si cambió el layout (p. ej., aparece SeekerResults)
    requestAnimationFrame(go);
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    scrollToSection();
  };

  const handleTouch: TouchEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    scrollToSection();
  };

  return (
    <button
      onClick={handleClick}
      onTouchStart={handleTouch}
      className={`group flex items-center border-2 border-dozeblue gap-3 font-semibold py-2 pl-4 pr-3 rounded-full transition-colors bg-greenlight text-dozeblue hover:bg-dozeblue hover:text-greenlight focus:outline-none focus:ring-2 focus:ring-greenlight ${className}`}
    >
      {content}
      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-dozeblue group-hover:bg-greenlight group-focus:ring-2 group-focus:ring-greenlight">
        <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1 text-greenlight group-hover:text-dozeblue" />
      </div>
    </button>
  );
};

export default AnimatedButton;
