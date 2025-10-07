// Enumeración de códigos de servicio y utilidades de tipado
import type * as React from 'react';

export type ServiceCode =
  | 'WIFI'
  | 'BREAKFAST'
  | 'RECEPTION_24H'
  | 'HOUSEKEEPING'
  | 'AIR_COND'
  | 'HEATING'
  | 'TV'
  | 'PRIVATE_BATH'
  | 'AMENITIES'
  | 'SAFE'
  | 'LUGGAGE'
  | 'ELEVATOR'
  | 'ACCESSIBLE'
  | 'PARKING'
  | 'VALET'
  | 'AIRPORT_SHUTTLE'
  | 'RESTAURANT'
  | 'BAR'
  | 'ROOM_SERVICE'
  | 'MINIBAR'
  | 'POOL'
  | 'SPA'
  | 'SAUNA'
  | 'JACUZZI'
  | 'GYM'
  | 'MASSAGE'
  | 'BUSINESS_CENTER'
  | 'MEETING_ROOM'
  | 'PRINTING'
  | 'FAMILY_ROOM'
  | 'CRIB'
  | 'PLAYGROUND'
  | 'BABYSITTING'
  | 'LAUNDRY'
  | 'DRY_CLEANING'
  | 'IRON'
  | 'CONCIERGE'
  | 'EXPRESS_CHECKIN'
  | 'WAKE_UP'
  | 'TOUR_DESK'
  | 'TICKETS'
  | 'PET_FRIENDLY'
  | 'EV_CHARGER'
  | 'BIKE'
  | 'ECO'
  | 'RECYCLING'
  | 'WATER_STATION';

export type IconName = ServiceCode;

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string; // atajo para width/height
  title?: string;
};
