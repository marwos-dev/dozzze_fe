export interface Price {
  price: number;
  occupancy: number;
}

export interface Rate {
  prices: Price[];
}

export interface AvailabilityItem {
  date: string;
  room_type: string;
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
