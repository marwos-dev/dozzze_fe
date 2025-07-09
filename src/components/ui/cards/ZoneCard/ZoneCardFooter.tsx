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

const fallbackThumbnail = '/logo.png';

const getSafeSrc = (src: string) =>
  typeof src === 'string' && src.startsWith('http') && src.length > 10
    ? src
    : fallbackThumbnail;

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
      {/* Miniaturas */}
      <div className="flex overflow-x-auto gap-2 pt-2 pb-2 scrollbar-hide">
        {(imageUrls.length > 0 ? imageUrls : [fallbackThumbnail]).map(
          (url, index) => {
            const safeSrc = getSafeSrc(url);
            const isSelected = safeSrc === selectedImage;

            return (
              <div
                key={index}
                className={`relative w-20 h-14 rounded-md cursor-pointer overflow-hidden border-2 ${
                  isSelected ? 'border-dozeblue' : 'border-transparent'
                }`}
                onClick={() => {
                  setSelectedImage(safeSrc);
                  setShowMap(false);
                }}
              >
                <Image
                  src={safeSrc}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  sizes="80px"
                  placeholder="empty"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
            );
          }
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
