import type { LatLngExpression } from "leaflet";

export interface PointWithMedia {
  id?: number;
  position: LatLngExpression;
  name?: string;
  coverImage?: string;
  rating?: number;
}
