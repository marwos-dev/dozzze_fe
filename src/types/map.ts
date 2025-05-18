import type { LatLngExpression } from "leaflet";

export interface PointWithMedia {
  position: LatLngExpression;
  images?: string[];
}
