import { Property } from "./property";

export interface Zone {
  id: number;
  name: string;
  description: string;
  area: string;
  cover_image: string | null;
  images: string[];
  properties: Property[];
}
