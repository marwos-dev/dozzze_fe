'use client';
import { MapPin, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ZoneCardHeaderProps {
  country: string;
  showMap: boolean;
  toggleMap: () => void;
}

export default function ZoneCardHeader({
  country,
  showMap,
  toggleMap,
}: ZoneCardHeaderProps) {
  return (
    <div className="flex justify-between items-center px-4 py-4">
      <h1 className="text-xl font-light tracking-widest font-sans text-dozegray">
        {country}
      </h1>

      <button
        onClick={toggleMap}
        className="bg-dozeblue text-greenlight px-4 py-2 rounded-full hover:bg-opacity-90 transition-all ease-in-out duration-300 flex items-center gap-2 min-w-[130px] justify-center w-[110px]"
        aria-label={showMap ? 'Ver imagen' : 'Ver mapa'}
        title={showMap ? 'Ver imagen' : 'Ver mapa'}
      >
        {showMap ? (
          <ImageIcon className="w-5 h-5" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
        <div className="w-[90px] text-sm text-center">
          <motion.span
            key={showMap ? 'imagen' : 'mapa'}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="block text-sm text-center whitespace-nowrap"
          >
            {showMap ? 'Ver imagen' : 'Ver mapa'}
          </motion.span>
        </div>
      </button>
    </div>
  );
}
