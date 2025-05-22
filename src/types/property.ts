import { Room } from "./room";

export interface Property {
  id: number;
  name: string;
  zone: string;
  zone_id: number;
  description: string;
  address: string;
  cover_image: string;
  images: string[];
  rooms: Room[];
  communication_methods: string[];
  location: string;
}
