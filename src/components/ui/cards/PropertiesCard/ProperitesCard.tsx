'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import PropertyCardMedia from './PropertyCardMedia';
import PropertyCardInfo from './PropertyCardInfo';
import ImageGalleryModal from '@/components/ui/modals/ImageGaleryModal';
import PropertyCardActions from './PropertyCardActions';
import PropertyRoomsCarousel from './PropertyRoomsCarousel';

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

  const hasRooms = (props.room_types?.length ?? 0) > 0;

  return (
    <div
      onClick={props.onClick}
      className={`bg-dozebg1 max-w-6xl rounded-2xl mx-2 my-3 sm:mx-3 shadow-lg overflow-hidden p-3 sm:p-5 flex flex-col gap-5 ${
        props.onClick ? 'cursor-pointer hover:shadow-xl transition' : ''
      }`}
    >
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-6">
        <div className="rounded-xl flex-shrink-0">
          <PropertyCardMedia
            images={props.images}
            coverImage={props.cover_image}
            onImageClick={openModalAtIndex}
          />
        </div>

        <div className="flex flex-col lg:flex-row flex-1 gap-4 lg:gap-6">
          <div className="flex-1">
            <PropertyCardInfo
              name={props.name}
              address={props.address}
              zone={props.zone}
              description={props.description}
            />
          </div>
          <div className="w-full lg:w-[240px]">
            <PropertyCardActions
              roomsCount={props.room_types?.length ?? 0}
              communication_methods={props.communication_methods}
              fullPropertyData={props}
            />
          </div>
        </div>
      </div>

      {hasRooms && (
        <PropertyRoomsCarousel
          rooms={props.room_types}
          propertyName={props.name}
        />
      )}

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
