import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  switch (status) {
    case "available":
      return "text-green-600 bg-green-50";
    case "limited":
      return "text-yellow-600 bg-yellow-50";
    case "unavailable":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}
