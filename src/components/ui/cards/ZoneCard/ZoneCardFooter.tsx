'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setSelectedZone } from '@/store/zoneSlice';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';

interface ZoneCardFooterProps {
  id: number;
  imageUrls: string[];
  selectedImage: string;
  setSelectedImage: (url: string) => void;
  setShowMap: (value: boolean) => void;
}

export default function ZoneCardFooter({
  id,
  imageUrls,
  selectedImage,
  setSelectedImage,
  setShowMap,
}: ZoneCardFooterProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="bg-dozebg1 mt-1 mb-4 px-4 shadow-md rounded-b-lg">
      {/* Miniaturas o fallback */}
      <div className="flex overflow-x-auto gap-2 pt-2 pb-2 scrollbar-hide">
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <div
              key={index}
              className={`relative w-20 h-14 rounded-md cursor-pointer overflow-hidden border-2 ${
                url === selectedImage ? 'border-dozeblue' : 'border-transparent'
              }`}
              onClick={() => {
                setSelectedImage(url);
                setShowMap(false);
              }}
            >
              <Image
                src={url}
                alt={`Miniatura ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))
        ) : (
          <div className="relative w-20 h-14 rounded-md overflow-hidden border-2 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
            <span className="absolute text-center px-2">Sin imágenes</span>
          </div>
        )}
      </div>

      {/* Botón */}
      <div className="mt-2 pb-4">
        <button
          onClick={() => {
            dispatch(setSelectedZone(id));
            router.push(`/zone/${id}`);
          }}
          className="bg-dozeblue text-greenlight text-sm px-4 py-2 rounded hover:bg-opacity-90 transition-all ease-in-out duration-300 w-full"
        >
          Explorar zona
        </button>
      </div>
    </div>
  );
}
