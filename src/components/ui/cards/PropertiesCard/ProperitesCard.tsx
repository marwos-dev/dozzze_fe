'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import PropertyCardMedia from './PropertyCardMedia';
import PropertyCardInfo from './PropertyCardInfo';
import ImageGalleryModal from '@/components/ui/modals/ImageGaleryModal';
import PropertyCardActions from './PropertyCardActions';

export default function PropertiesCard(props: Property) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const openModalAtIndex = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  return (
    <div className="bg-dozebg1 max-w-6xl rounded-xl mx-1 m-2 md:mx-2 shadow-md overflow-hidden p-4 flex flex-col md:flex-row gap-4">
      <div className="rounded-xl ">
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
            id={props.id}
            roomsCount={props.room_types?.length ?? 0}
            communication_methods={props.communication_methods}
            fullPropertyData={props}
          />
        </div>
      </div>

      {modalOpen && (
        <ImageGalleryModal
          images={props.images}
          initialIndex={modalIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
