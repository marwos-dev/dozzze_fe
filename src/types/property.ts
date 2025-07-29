import { RoomType } from './roomType';

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
  communication_methods: string[];
  location: string;
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
  address: string;
  description: string;
  coverImage: string;
  latitude: null;
  longitude: null;
  zone: string;
  zone_id: number | null;
  images: string[];
}
