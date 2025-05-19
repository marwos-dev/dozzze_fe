import { PointWithMedia } from "@/types/map";
import { Zone } from "@/types/zone";


export function extractPoints(properties: Zone["properties"]): PointWithMedia[] {
    return properties.map((prop) => {
      const coords = JSON.parse(prop.location).coordinates;
      return {
        id: prop.id,
        position: [coords[1], coords[0]],
        images: prop.images,
      };
    });
  }