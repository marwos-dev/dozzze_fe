export interface Room {
  id: number;
  name: string;
  description: string;
  pax: number;
  services: string[];
  images: string[];
}

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

export interface Zone {
  id: number;
  name: string;
  description: string;
  area: string;
  cover_image: string | null;
  images: string[];
  properties: {
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
  }[];
}
