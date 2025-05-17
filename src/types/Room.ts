export interface Room {
    id: number;
    name: string;
    description: string;
    pax: number;
    images: string[];
    features?: string[];
  }