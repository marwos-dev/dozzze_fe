'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import PropertyCardMedia from './PropertyCardMedia';
import PropertyCardInfo from './PropertyCardInfo';
import ImageGalleryModal from '@/components/ui/modals/ImageGaleryModal';
import PropertyCardActions from './PropertyCardActions';

interface PropertiesCardProps extends Property {
  onClick?: () => void;
}

export default function PropertiesCard(props: PropertiesCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImages, setModalImages] = useState<string[]>([]);

  const openModalAtIndex = (index: number, imageList: string[]) => {
    if (props.onClick) return;
    setModalImages(imageList);
    setModalIndex(index);
    setModalOpen(true);
  };

  return (
    <div
      onClick={props.onClick}
      className={`bg-dozebg1 max-w-6xl rounded-xl mx-1 m-2 md:mx-2 shadow-md overflow-hidden p-4 flex flex-col md:flex-row gap-4 ${
        props.onClick ? 'cursor-pointer hover:shadow-lg transition' : ''
      }`}
    >
      <div className="rounded-xl">
        <PropertyCardMedia
          images={props.images}
          coverImage={props.cover_image}
          onImageClick={openModalAtIndex}
        />
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4">
        <div className="flex-1">
          <PropertyCardInfo
            name={props.name}
            address={props.address}
            zone={props.zone}
            description={props.description}
          />
        </div>
        <div className="md:w-[220px]">
          <PropertyCardActions
            roomsCount={props.room_types?.length ?? 0}
            communication_methods={props.communication_methods}
            fullPropertyData={props}
          />
        </div>
      </div>

      {modalOpen && (
        <ImageGalleryModal
          images={modalImages}
          initialIndex={modalIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
