import type { FoodCenter } from "@crowdsourced-meal-map/shared";

export function parseGeographyPoint(
  point: string,
): { lat: number; lng: number } | undefined {
  if (!point) return undefined;
  // Parse POINT(lng lat) string, e.g., "POINT(13.3950 52.5021)"
  const match = point.match(/POINT\(([-0-9.]+)\s+([-0-9.]+)\)/);
  if (!match) return undefined;
  return {
    lng: parseFloat(match[1]!),
    lat: parseFloat(match[2]!),
  };
}

// Transform raw query result to FoodCenter type
export function transformFoodCenter(item: any): FoodCenter {
  return {
    ...item,
    location: { lat: item.lat, lng: item.lng },
  } as FoodCenter;
}
