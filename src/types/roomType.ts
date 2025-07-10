export interface Price {
  price: number;
  occupancy: number;
}

export interface Rate {
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
}

export interface RoomType {
  id: number;
  name: string;
  description?: string;
}

export interface AvailabilityPayload {
  check_in: string;
  check_out: string;
  guests: number;
  property_id?: number;
}

export interface TotalPricePerRoomType {
  [key: string]: {
    rate_index: number;
    total_price: number;
  }[];
}

export interface AvailabilityResponse {
  rooms: AvailabilityItem[];
  total_price_per_room_type: TotalPricePerRoomType;
}
