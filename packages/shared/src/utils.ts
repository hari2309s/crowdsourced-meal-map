import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AVAILABILITY_STATUS_COLORS,
  DIETARY_RESTRICTION_COLORS,
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
    AVAILABILITY_STATUS_COLORS[status] ?? AVAILABILITY_STATUS_COLORS["unknown"]!
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
    case "food_bank":
      return { bg: "bg-blue-600", text: "text-white" };
    case "community_kitchen":
      return { bg: "bg-green-600", text: "text-white" };
    case "soup_kitchen":
      return { bg: "bg-orange-400", text: "text-white" };
    case "mobile_unit":
      return { bg: "bg-purple-500", text: "text-white" };
    case "pantry":
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
  const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;
  window.open(url, "_blank");
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
