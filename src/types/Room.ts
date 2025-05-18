export interface Room {
  id: number;
  name: string;
  description: string;
  pax: number;
  services?: string[];
  images: string[];
}
