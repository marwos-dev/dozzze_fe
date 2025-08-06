export interface Price {
  price: number;
  occupancy: number;
}

export interface Rate {
  rate_id: number;
  prices: Price[];
  restriction?: Record<string, unknown>;
}

export interface AvailabilityItem {
  date: string;
  room_type: string;
  room_type_id: number;
  availability: number;
  rates: Rate[];
  property_id: number;
  total_price?: number;
  images?: string[];
}

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  images?: string[];
}

export interface AvailabilityPayload {
  check_in: string;
  check_out: string;
  guests: number;
  property_id?: number;
  images?: string[];
}

export interface TotalPricePerRoomType {
  [key: string]: {
    rate_id: number;
    total_price: number;
  }[];
}

export interface AvailabilityResponse {
  rooms: AvailabilityItem[];
  images?: string[];

  total_price_per_room_type: TotalPricePerRoomType;
}
