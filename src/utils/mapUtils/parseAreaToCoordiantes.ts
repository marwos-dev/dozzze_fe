import { LatLngExpression } from "leaflet";

export function parseAreaToCoordinates(area: string): LatLngExpression[] {
  try {
    const parsed = JSON.parse(area);
    return parsed.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
  } catch {
    return [];
  }
}
