import type { LatLngExpression } from "leaflet";

export interface PointWithMedia {
  id: number; 
  position: LatLngExpression;
  images?: string[];
}
