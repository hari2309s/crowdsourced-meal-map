import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AVAILABILITY_STATUS_COLORS,
  DIETARY_RESTRICTION_COLORS,
  FOOD_CENTER_TYPE_VALUES,
  AVAILABILITY_STATUS_VALUES,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatOperatingHours(
  hours: Record<string, { open: string; close: string }> | undefined,
): string {
  if (!hours) return "Hours not specified";

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();
  const todayHours = hours[today];

  if (!todayHours) return "Closed today";

  return `${todayHours.open} - ${todayHours.close}`;
}

export function getStatusColor(status: string): string {
  return (
    AVAILABILITY_STATUS_COLORS[status] ??
    AVAILABILITY_STATUS_COLORS[AVAILABILITY_STATUS_VALUES.UNKNOWN]!
  );
}

export function removeUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as T;
}

/**
 * Returns Tailwind bg and text color classes for a food center type badge.
 * @param type Food center type string
 * @returns { bg: string, text: string }
 */
export function getFoodCenterTypeColorClasses(type: string): {
  bg: string;
  text: string;
} {
  switch (type) {
    case FOOD_CENTER_TYPE_VALUES.FOOD_BANK:
      return { bg: "bg-blue-600", text: "text-white" };
    case FOOD_CENTER_TYPE_VALUES.COMMUNITY_KITCHEN:
      return { bg: "bg-green-600", text: "text-white" };
    case FOOD_CENTER_TYPE_VALUES.SOUP_KITCHEN:
      return { bg: "bg-orange-400", text: "text-white" };
    case FOOD_CENTER_TYPE_VALUES.MOBILE_UNIT:
      return { bg: "bg-purple-500", text: "text-white" };
    case FOOD_CENTER_TYPE_VALUES.PANTRY:
      return { bg: "bg-rose-500", text: "text-white" };
    default:
      return { bg: "bg-stone-200", text: "text-stone-800" };
  }
}

/**
 * Returns Tailwind bg and text color classes for a dietary restriction badge.
 * @param restriction Dietary restriction string
 * @returns { bg: string, text: string }
 */
export function getDietaryRestrictionColorClasses(restriction: string): {
  bg: string;
  text: string;
} {
  switch (restriction) {
    case "vegetarian":
      return { bg: "bg-green-500", text: "text-white" };
    case "vegan":
      return { bg: "bg-green-700", text: "text-white" };
    case "halal":
      return { bg: "bg-teal-600", text: "text-white" };
    case "kosher":
      return { bg: "bg-indigo-600", text: "text-white" };
    case "gluten_free":
      return { bg: "bg-amber-500", text: "text-white" };
    case "dairy_free":
      return { bg: "bg-cyan-500", text: "text-white" };
    case "nut_free":
      return { bg: "bg-pink-500", text: "text-white" };
    default:
      return { bg: "bg-gray-200", text: "text-gray-800" };
  }
}

/**
 * Returns the hex color for a dietary restriction.
 * @param restriction Dietary restriction string
 * @returns Hex color string
 */
export function getDietaryRestrictionColor(restriction: string): string {
  return DIETARY_RESTRICTION_COLORS[restriction] ?? "#6b7280"; // gray-500 fallback
}

/**
 * Returns a string key for the best icon for a given dietary restriction.
 */
export function getDietaryIconKey(restriction: string): string | null {
  switch (restriction) {
    case "vegetarian":
      return "leaf";
    case "vegan":
      return "sprout";
    case "halal":
      return "moon";
    case "kosher":
      return "star-of-david";
    case "gluten_free":
      return "wheat";
    case "dairy_free":
      return "milk";
    case "nut_free":
      return "nut";
    default:
      return null;
  }
}

/**
 * Returns a human-friendly label for a dietary restriction.
 */
export function getDietaryLabel(restriction: string): string {
  switch (restriction) {
    case "vegetarian":
      return "Vegetarian";
    case "vegan":
      return "Vegan";
    case "halal":
      return "Halal";
    case "kosher":
      return "Kosher";
    case "gluten_free":
      return "Gluten Free";
    case "dairy_free":
      return "Dairy Free";
    case "nut_free":
      return "Nut Free";
    default:
      return restriction;
  }
}

/**
 * Handles locale change in URL by replacing the current locale segment
 * @param newLocale The new locale to switch to
 * @param currentPath The current window path
 * @param supportedLocales Array of supported locale objects
 * @returns The new path with updated locale
 */
export function handleLocaleChange(
  newLocale: string,
  currentPath: string,
  supportedLocales: readonly {
    code: string;
    label: string;
    enabled: boolean;
  }[],
): string {
  const segments = currentPath.split("/");
  if (supportedLocales.some((l) => l.code === segments[1])) {
    segments[1] = newLocale;
  } else {
    segments.splice(1, 0, newLocale);
  }
  return segments.join("/");
}

/**
 * Opens a location in the default maps application
 * @param lat Latitude coordinate
 * @param lng Longitude coordinate
 */
export function openLocationInMaps(lat: number, lng: number): void {
  // Check if we're on a mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  let url: string;

  if (isMobile) {
    // Use platform-specific URL schemes for native map apps
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      // iOS - try Apple Maps first, then Google Maps
      url = `maps://maps.apple.com/?q=${lat},${lng}`;
    } else if (/android/.test(userAgent)) {
      // Android - try Google Maps first, then other map apps
      url = `geo:${lat},${lng}?q=${lat},${lng}`;
    } else {
      // Fallback for other mobile devices
      url = `https://maps.google.com/maps?q=${lat},${lng}`;
    }
  } else {
    // Desktop - detect OS and use appropriate map application
    const userAgent = navigator.userAgent.toLowerCase();

    if (/macintosh|mac os x/.test(userAgent)) {
      // macOS - try Apple Maps, then Google Maps
      url = `maps://maps.apple.com/?q=${lat},${lng}`;
    } else if (/windows/.test(userAgent)) {
      // Windows - try Microsoft Maps, then Google Maps
      url = `bingmaps://?cp=${lat}~${lng}&lvl=15`;
    } else if (/linux/.test(userAgent)) {
      // Linux - use Google Maps as default (most Linux users prefer web-based maps)
      url = `https://maps.google.com/maps?q=${lat},${lng}`;
    } else {
      // Fallback for other desktop OS
      url = `https://maps.google.com/maps?q=${lat},${lng}`;
    }
  }

  // Try to open the native app, fallback to web if it fails
  try {
    window.location.href = url;
  } catch (error) {
    // Fallback to web-based maps
    const webUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
    window.open(webUrl, "_blank");
  }
}

/**
 * Copies coordinates to clipboard in a formatted string
 * @param lat Latitude coordinate
 * @param lng Longitude coordinate
 * @returns Promise that resolves when copying is complete
 */
export function copyCoordinatesToClipboard(
  lat: number,
  lng: number,
): Promise<void> {
  const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  return navigator.clipboard.writeText(coords);
}

/**
 * Validates if a given locale is supported
 * @param locale The locale string to validate
 * @param supportedLocales Array of supported locale objects
 * @returns boolean indicating if locale is supported
 */
export function isLocaleSupported(
  locale: string,
  supportedLocales: readonly {
    code: string;
    label: string;
    enabled: boolean;
  }[],
): boolean {
  return supportedLocales.some((l) => l.code === locale && l.enabled);
}

/**
 * Returns the background color class for a food center based on its availability status
 * @param availability The availability status of the food center
 * @returns Tailwind CSS class for the background color
 */
export function getAvailabilityBgColor(availability?: string): string {
  switch (availability) {
    case AVAILABILITY_STATUS_VALUES.AVAILABLE:
      return "bg-green-50";
    case AVAILABILITY_STATUS_VALUES.LIMITED:
      return "bg-yellow-50";
    case AVAILABILITY_STATUS_VALUES.UNAVAILABLE:
      return "bg-red-50";
    default:
      return "bg-stone-50";
  }
}

/**
 * Formats an address for display in multiline format:
 * address\ndistrict?\npostal_code city\ncountry
 * Skips empty fields and avoids duplicate lines.
 */
export function formatAddress(
  address?: string,
  district?: string,
  postal_code?: string,
  city?: string,
  country?: string,
): string {
  const lines: string[] = [];

  // Add address if it exists and doesn't contain city/postal_code
  if (address) {
    const cleanAddress = address
      .replace(/,?\s*(?:Berlin|Germany|12351|12687|10179|12053)/g, "")
      .trim();
    if (cleanAddress) lines.push(cleanAddress);
  }

  // Add district if it exists and is different from address
  if (district && district !== address && !address?.includes(district)) {
    lines.push(district);
  }

  // Add postal_code and city together, avoiding duplicates
  const locationParts = [];
  if (postal_code && postal_code !== city) locationParts.push(postal_code);
  if (city) locationParts.push(city);
  if (locationParts.length > 0) {
    lines.push(locationParts.join(" "));
  }

  // Add country if it exists and is different from city
  if (country && country !== city) {
    lines.push(country);
  }

  // Remove empty and duplicate lines
  return lines.filter((line, i) => line && line !== lines[i - 1]).join("\n");
}

/**
 * Returns the walking distance in kilometers between two lat/lng points using the Haversine formula.
 * @param from { lat, lng }
 * @param to { lat, lng }
 * @returns distance in kilometers (float, 2 decimals)
 */
export function getWalkingDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  // Validate inputs
  if (!from || !to) {
    return 0;
  }

  if (
    typeof from.lat !== "number" ||
    typeof from.lng !== "number" ||
    typeof to.lat !== "number" ||
    typeof to.lng !== "number"
  ) {
    return 0;
  }

  if (isNaN(from.lat) || isNaN(from.lng) || isNaN(to.lat) || isNaN(to.lng)) {
    return 0;
  }

  const R = 6371; // Radius of the Earth in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

/**
 * Sorts an array of food centers by walking distance from the user location (ascending).
 * @param centers Array of FoodCenter
 * @param userLocation { lat, lng }
 * @returns Sorted array of FoodCenter
 */
/**
 * Checks if a food center is currently open based on its operating hours
 * @param hours Operating hours object
 * @returns boolean indicating if the center is currently open
 */
export function isCurrentlyOpen(
  hours: Record<string, { open: string; close: string }> | undefined,
): boolean {
  if (!hours) return false;

  const now = new Date();
  const today = now
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();
  const todayHours = hours[today];

  if (!todayHours) return false;

  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseInt(todayHours.open.replace(":", ""));
  const closeTime = parseInt(todayHours.close.replace(":", ""));

  return currentTime >= openTime && currentTime <= closeTime;
}

/**
 * Calculate a score for sorting food centers based on distance and opening hours
 * @param center Food center to score
 * @param userLocation User's location
 * @returns Score (lower is better)
 */
export function getFoodCenterScore(
  center: {
    location: { lat: number; lng: number };
    operating_hours?: Record<string, { open: string; close: string }>;
  },
  userLocation: { lat: number; lng: number } | null | undefined,
): number {
  if (!userLocation) return 0;

  const distance = getWalkingDistanceKm(userLocation, center.location);
  const isOpen = isCurrentlyOpen(center.operating_hours);

  return isOpen ? distance : distance + 1000;
}

/**
 * Sorts an array of food centers by a combination of opening status and distance
 * Open centers are prioritized, then sorted by distance
 */
export function sortByDistance<
  T extends {
    location: { lat: number; lng: number };
    operating_hours?: Record<string, { open: string; close: string }>;
  },
>(
  centers: T[],
  userLocation: { lat: number; lng: number } | null | undefined,
): T[] {
  if (!userLocation) return centers;
  return [...centers].sort((a, b) => {
    const scoreA = getFoodCenterScore(a, userLocation);
    const scoreB = getFoodCenterScore(b, userLocation);
    return scoreA - scoreB;
  });
}
