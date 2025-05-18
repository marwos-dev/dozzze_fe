import { Room } from "./room";

export interface Property {
  id: number;
  name: string;
  zone: string;
  description: string;
  address: string;
  cover_image: string;
  images: string[];
  rooms: Room[];
  communication_methods: string[];
  location: string;
}
