import { RoomType } from './roomType';

export interface PropertyService {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface Property {
  id: number;
  name: string;
  zone: string;
  zone_id: number;
  description: string;
  address: string;
  cover_image: string;
  images: string[];
  room_types: RoomType[];
  services?: PropertyService[];
  communication_methods: string[];
  location: string;
  pms_id: number;
  latitude: number | null;
  longitude: number | null;
  terms_and_conditions: {
    condition_of_confirmation: string;
    check_in_time: string;
    check_out_time: string;
    cancellation_policy: string;
    additional_information: string;
  };
}

export interface PropertyFormData {
  name: string;
  pms_id: number | null;
  description: string;
  coverImage: string;
  images: (string | File)[];
  zone: string;
  zone_id: number | null;
  latitude: number | null;
  longitude: number | null;
  address?: string;
}

export interface PropertySyncData {
  base_url: string;
  email: string;
  phone_number: string;
  pms_token: string;
  pms_hotel_identifier: string;
  pms_username: string;
  pms_password: string;
}

export interface SyncData {
  base_url: string;
  email: string;
  phone_number: string;
  pms_token: string;
  pms_hotel_identifier: string;
  pms_username: string;
  pms_password: string;
}
