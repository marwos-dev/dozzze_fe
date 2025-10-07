import * as React from 'react';
import type { IconProps, ServiceCode } from './serviceCodes';

const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24,
  stroke = 'currentColor',
  fill = 'none',
  strokeWidth = 1.8,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  children,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden={rest.title ? undefined : true}
    role={rest.title ? 'img' : 'presentation'}
    xmlns="http://www.w3.org/2000/svg"
    {...{ stroke, fill, strokeWidth, strokeLinecap, strokeLinejoin }}
    {...rest}
  >
    {rest.title ? <title>{rest.title}</title> : null}
    {children}
  </svg>
);

// ==== Iconos (dibujos simples, consistentes y legibles en 24px) ====

export const WifiIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M2.5 8.5a14 14 0 0 1 19 0" />
    <path d="M5 11.5a10 10 0 0 1 14 0" />
    <path d="M7.5 14.5a6 6 0 0 1 9 0" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
  </BaseIcon>
);

export const BreakfastIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M4 16h12a3 3 0 0 0 3-3V6H4z" />
    <path d="M19 8h1.5a1.5 1.5 0 0 1 0 3H19" />
    <path d="M4 18h14" />
  </BaseIcon>
);

export const Reception24hIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 2.5" />
    <text x="7" y="13.5" fontSize="4" fill="currentColor" stroke="none">24</text>
  </BaseIcon>
);

export const HousekeepingIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M6 16l3-8h6l3 8" />
    <path d="M5 16h14" />
    <path d="M10 8V6a2 2 0 1 1 4 0v2" />
  </BaseIcon>
);

export const ACIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v5M12 17v5M2 12h5M17 12h5M4.5 4.5l3.5 3.5M16 16l3.5 3.5M19.5 4.5 16 8M8 16l-3.5 3.5" />
  </BaseIcon>
);

export const TVIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M8 6l4-3 4 3" />
  </BaseIcon>
);

export const BathIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="4" y="12" width="16" height="5" rx="2" />
    <path d="M6 12V7a2 2 0 0 1 4 0v5" />
    <path d="M14 9h4" />
  </BaseIcon>
);

export const AmenitiesIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M7 17h10l-1-6H8z" />
    <rect x="10" y="5" width="4" height="4" rx="1" />
  </BaseIcon>
);

export const SafeIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 10v4M10 12h4" />
  </BaseIcon>
);

export const LuggageIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="7" y="7" width="10" height="11" rx="2" />
    <path d="M9 7V5h6v2" />
    <path d="M9 18v2M15 18v2" />
  </BaseIcon>
);

export const ElevatorIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 17V7l-2 2M9 7l2 2" />
    <path d="M15 7v10l2-2M15 17l-2-2" />
  </BaseIcon>
);

export const AccessibleIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="6" r="2" />
    <path d="M12 8v4l4 1" />
    <path d="M8 13l4-1" />
    <circle cx="12" cy="17" r="3.5" />
  </BaseIcon>
);

export const ParkingIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="5" y="4" width="14" height="16" rx="2" />
    <path d="M9 16V8h3.5a2.5 2.5 0 1 1 0 5H9" />
  </BaseIcon>
);

export const ValetIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M4 18h16" />
    <path d="M6 18V9h6l2 3h4v6" />
    <circle cx="8" cy="20" r="1.5" fill="currentColor" />
    <circle cx="18" cy="20" r="1.5" fill="currentColor" />
  </BaseIcon>
);

export const ShuttleIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="3" y="9" width="18" height="8" rx="2" />
    <path d="M6 9v-1a2 2 0 0 1 2-2h4" />
    <circle cx="8" cy="19" r="1.5" fill="currentColor" />
    <circle cx="18" cy="19" r="1.5" fill="currentColor" />
  </BaseIcon>
);

export const RestaurantIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M7 4v8M10 4v8M7 8h3" />
    <path d="M16 4v8a2 2 0 0 1-2 2h-1" />
  </BaseIcon>
);

export const BarIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M6 4h12l-4 6v6H10V10z" />
    <path d="M8 20h8" />
  </BaseIcon>
);

export const RoomServiceIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M4 16h16" />
    <path d="M6 16a6 6 0 0 1 12 0" />
    <circle cx="12" cy="9" r="1" />
  </BaseIcon>
);

export const MinibarIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="6" y="5" width="12" height="14" rx="2" />
    <path d="M12 5v14M9 9h2M13 9h2" />
  </BaseIcon>
);

export const PoolIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M7 7c0-2 2-3 5-3s5 1 5 3v10" />
    <path d="M4 15s1.5 2 4 2 4-2 6-2 4 2 6 2" />
  </BaseIcon>
);

export const SpaIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M12 3c-2 2-3 4.5-3 6.5a3 3 0 0 0 6 0C15 7.5 14 5 12 3z" />
    <path d="M5 18h14" />
  </BaseIcon>
);

export const SaunaIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M6 19h12" />
    <path d="M7 15h10" />
    <path d="M9 6c0 1 .5 1.5 .5 2.5S9 10 9 11" />
    <path d="M13 6c0 1 .5 1.5 .5 2.5S13 10 13 11" />
  </BaseIcon>
);

export const JacuzziIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="4" y="10" width="16" height="7" rx="3" />
    <path d="M6 13s1 1 3 1 3-1 5-1 3 1 4 1" />
  </BaseIcon>
);

export const GymIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="4" y="10" width="4" height="4" rx="1" />
    <rect x="16" y="10" width="4" height="4" rx="1" />
    <path d="M8 12h8" />
  </BaseIcon>
);

export const MassageIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="8" cy="8" r="2" />
    <path d="M4 16l5-3 3 1 5 2" />
  </BaseIcon>
);

export const BusinessCenterIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="4" y="8" width="16" height="10" rx="2" />
    <path d="M9 8V6h6v2" />
  </BaseIcon>
);

export const MeetingRoomIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="3" y="7" width="12" height="10" rx="2" />
    <path d="M15 10h6v4h-6" />
  </BaseIcon>
);

export const PrintingIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M7 9V5h10v4" />
    <rect x="5" y="9" width="14" height="7" rx="2" />
    <rect x="8" y="14" width="8" height="5" rx="1" />
  </BaseIcon>
);

export const FamilyRoomIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M3 11l9-6 9 6" />
    <rect x="6" y="11" width="12" height="8" rx="2" />
    <circle cx="10" cy="15" r="1" fill="currentColor" />
    <circle cx="14" cy="15" r="1" fill="currentColor" />
  </BaseIcon>
);

export const CribIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="5" y="9" width="14" height="8" rx="2" />
    <path d="M7 9v8M10 9v8M13 9v8M16 9v8" />
  </BaseIcon>
);

export const PlaygroundIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="7" cy="9" r="2" />
    <path d="M4 16l6-3 6 3" />
    <path d="M7 11v5M13 13v3" />
  </BaseIcon>
);

export const BabysittingIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="9" cy="9" r="2" />
    <circle cx="15" cy="11" r="1.5" />
    <path d="M4 18l5-3 6 3" />
  </BaseIcon>
);

export const LaundryIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="5" y="4" width="14" height="16" rx="2" />
    <circle cx="12" cy="13" r="3.5" />
    <path d="M8 7h2M12 7h2" />
  </BaseIcon>
);

export const DryCleaningIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M6 8l6-4 6 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
    <path d="M9 12h6M9 15h6" />
  </BaseIcon>
);

export const IronIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M4 15h14a2 2 0 0 0 2-2v-1H9a5 5 0 0 0-5 5" />
    <path d="M7 12h10" />
  </BaseIcon>
);

export const ConciergeIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="7" r="3" />
    <path d="M4 20a8 8 0 0 1 16 0" />
    <path d="M12 10v3" />
  </BaseIcon>
);

export const ExpressCheckinIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="4" y="4" width="12" height="16" rx="2" />
    <path d="M9 12h10M15 9l2 3-2 3" />
  </BaseIcon>
);

export const WakeUpIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="13" r="5" />
    <path d="M12 13V9M5 6l2 2M17 6l-2 2" />
  </BaseIcon>
);

export const TourDeskIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M3 18h18" />
    <path d="M5 18V9h10l2 3h2v6" />
  </BaseIcon>
);

export const TicketsIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="5" y="7" width="14" height="10" rx="2" />
    <path d="M8 7v10M16 7v10" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </BaseIcon>
);

export const PetFriendlyIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="8" cy="9" r="1.5" />
    <circle cx="12" cy="7" r="1.5" />
    <circle cx="16" cy="9" r="1.5" />
    <path d="M8 14c1.5-1 6.5-1 8 0 1.5 1-1 3-4 3s-5.5-2-4-3z" />
  </BaseIcon>
);

export const EVChargerIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="7" y="4" width="8" height="16" rx="2" />
    <path d="M15 8h2l1 2v6M9 10l4-2-2 4" />
  </BaseIcon>
);

export const BikeIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="7" cy="16" r="3" />
    <circle cx="17" cy="16" r="3" />
    <path d="M7 16l4-7h3l3 7M11 9l3 7" />
  </BaseIcon>
);

export const EcoIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M12 3c-3 3-5 6-5 8a5 5 0 0 0 10 0c0-2-2-5-5-8z" />
    <path d="M12 8c-1 2-1 4 0 6" />
  </BaseIcon>
);

export const RecyclingIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <path d="M7 8l2-3 3 2-1 2z" />
    <path d="M10 18H6l-2-3 2-2" />
    <path d="M17 8l-2-3-3 2 1 2z" />
    <path d="M14 18h4l2-3-2-2" />
  </BaseIcon>
);

export const WaterStationIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <rect x="7" y="4" width="10" height="16" rx="2" />
    <path d="M12 7c-2 2-3 3.5-3 5a3 3 0 0 0 6 0c0-1.5-1-3-3-5z" />
  </BaseIcon>
);

export const DefaultIcon: React.FC<IconProps> = (p) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8M12 8v8" />
  </BaseIcon>
);

// ===== Mapa código → componente =====
export const SERVICE_ICON_MAP: Record<ServiceCode, React.FC<IconProps>> = {
  WIFI: WifiIcon,
  BREAKFAST: BreakfastIcon,
  RECEPTION_24H: Reception24hIcon,
  HOUSEKEEPING: HousekeepingIcon,
  AIR_COND: ACIcon,
  HEATING: ACIcon,
  TV: TVIcon,
  PRIVATE_BATH: BathIcon,
  AMENITIES: AmenitiesIcon,
  SAFE: SafeIcon,
  LUGGAGE: LuggageIcon,
  ELEVATOR: ElevatorIcon,
  ACCESSIBLE: AccessibleIcon,
  PARKING: ParkingIcon,
  VALET: ValetIcon,
  AIRPORT_SHUTTLE: ShuttleIcon,
  RESTAURANT: RestaurantIcon,
  BAR: BarIcon,
  ROOM_SERVICE: RoomServiceIcon,
  MINIBAR: MinibarIcon,
  POOL: PoolIcon,
  SPA: SpaIcon,
  SAUNA: SaunaIcon,
  JACUZZI: JacuzziIcon,
  GYM: GymIcon,
  MASSAGE: MassageIcon,
  BUSINESS_CENTER: BusinessCenterIcon,
  MEETING_ROOM: MeetingRoomIcon,
  PRINTING: PrintingIcon,
  FAMILY_ROOM: FamilyRoomIcon,
  CRIB: CribIcon,
  PLAYGROUND: PlaygroundIcon,
  BABYSITTING: BabysittingIcon,
  LAUNDRY: LaundryIcon,
  DRY_CLEANING: DryCleaningIcon,
  IRON: IronIcon,
  CONCIERGE: ConciergeIcon,
  EXPRESS_CHECKIN: ExpressCheckinIcon,
  WAKE_UP: WakeUpIcon,
  TOUR_DESK: TourDeskIcon,
  TICKETS: TicketsIcon,
  PET_FRIENDLY: PetFriendlyIcon,
  EV_CHARGER: EVChargerIcon,
  BIKE: BikeIcon,
  ECO: EcoIcon,
  RECYCLING: RecyclingIcon,
  WATER_STATION: WaterStationIcon,
};

export function getServiceIcon(code: ServiceCode | string) {
  const key = code as ServiceCode;
  return SERVICE_ICON_MAP[key] ?? DefaultIcon;
}
