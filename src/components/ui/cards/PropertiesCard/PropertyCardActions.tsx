'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSelectedProperty } from '@/store/propertiesSlice';
import slugify from '@/utils/slugify';
import { ArrowRight, Phone, Mail, MessageCircleMore } from 'lucide-react';
import { Property } from '@/types/property';
import { useLanguage } from '@/i18n/LanguageContext';

interface PropertyCardActionsProps {
  communication_methods: string[];
  roomsCount: number;
  fullPropertyData: Property;
}

const getMethodIcon = (method: string) => {
  if (method.toLowerCase().includes('whatsapp'))
    return <MessageCircleMore className="w-4 h-4 mr-1" />;
  if (method.toLowerCase().includes('tel'))
    return <Phone className="w-4 h-4 mr-1" />;
  if (method.toLowerCase().includes('mail') || method.includes('@'))
    return <Mail className="w-4 h-4 mr-1" />;
  return <MessageCircleMore className="w-4 h-4 mr-1" />;
};

export default function PropertyCardActions({
  communication_methods,
  roomsCount,
  fullPropertyData,
}: PropertyCardActionsProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useLanguage();
  const noContactLabel = String(t('propertyCard.actions.noContact'));
  const roomsLabel = String(t('propertyCard.actions.roomsLabel'));
  const viewRoomsLabel = String(t('propertyCard.actions.viewRooms'));

  const handleSelect = () => {
    dispatch(setSelectedProperty(fullPropertyData));
    router.push(`/properties/${slugify(fullPropertyData.name)}`);
  };

  return (
    <div
      style={{ backgroundColor: '#e6e4ff' }}
      className="flex flex-col rounded-xl items-center md:items-end gap-4 text-center md:text-right w-full h-full p-4"
    >
      {/* Métodos de contacto */}
      <div className="flex flex-wrap gap-2 p-2 justify-center md:justify-end">
        {(communication_methods.length > 0
          ? communication_methods
          : [noContactLabel]
        ).map((method, i) => (
          <span
            key={i}
            className="inline-flex items-center text-sm bg-dozebg1 text-dozegray px-3 py-1 rounded-full border border-gray-300"
          >
            {getMethodIcon(method)}
            {method}
          </span>
        ))}
      </div>

      {/* Habitaciones + botón */}
      <div className="flex flex-col items-center md:items-end w-full gap-3">
        <p className="text-sm font-semibold p-2 text-dozeblue ">
          {roomsLabel} {roomsCount}
        </p>
        <button
          onClick={handleSelect}
          className="inline-flex items-center bg-dozeblue text-white px-4 py-2 text-sm rounded-full font-medium hover:bg-blue-900 mt-auto transition"
        >
          {viewRoomsLabel}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
