export const FOOD_CENTER_TYPES = [
  { value: "food_bank", label: "Food Bank" },
  { value: "community_kitchen", label: "Community Kitchen" },
  { value: "soup_kitchen", label: "Soup Kitchen" },
  { value: "mobile_unit", label: "Mobile Unit" },
  { value: "pantry", label: "Pantry" },
] as const;

export const FOOD_CENTER_TYPE_COLORS: Record<string, string> = {
  food_bank: "#2563eb", // blue
  community_kitchen: "#16a34a", // green
  soup_kitchen: "#f59e42", // orange
  mobile_unit: "#d946ef", // purple
  pantry: "#f43f5e", // red
};

export const DIETARY_RESTRICTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
  { value: "nut_free", label: "Nut Free" },
] as const;

export const DIETARY_RESTRICTION_COLORS: Record<string, string> = {
  vegetarian: "#22c55e", // green-500
  vegan: "#15803d", // green-700
  halal: "#0d9488", // teal-600
  kosher: "#4f46e5", // indigo-600
  gluten_free: "#f59e0b", // amber-500
  dairy_free: "#06b6d4", // cyan-500
  nut_free: "#ec4899", // pink-500
};

export const AVAILABILITY_STATUSES = [
  { value: "available", label: "Available", color: "green" },
  { value: "limited", label: "Limited", color: "yellow" },
  { value: "unavailable", label: "Unavailable", color: "red" },
  { value: "unknown", label: "Unknown", color: "gray" },
] as const;

export const AVAILABILITY_STATUS_COLORS: Record<string, string> = {
  available: "text-green-700 bg-green-100",
  limited: "text-yellow-700 bg-yellow-100",
  unavailable: "text-red-700 bg-red-100",
  unknown: "text-stone-600 bg-stone-100",
};

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "ar", label: "العربية" },
  { value: "tr", label: "Türkçe" },
] as const;

export const DEFAULT_MAP_CENTER = {
  lat: 52.52,
  lng: 13.405,
}; // Central Berlin

// Function to calculate bounds around a center point
export function calculateBoundsAroundLocation(
  center: { lat: number; lng: number },
  radiusKm = 5,
) {
  // Approximate conversion: 1 degree latitude ≈ 111 km
  // Longitude varies by latitude, at Berlin's latitude ~71 km per degree
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));

  return {
    southwest: {
      lat: center.lat - latDelta,
      lng: center.lng - lngDelta,
    },
    northeast: {
      lat: center.lat + latDelta,
      lng: center.lng + lngDelta,
    },
  };
}

// Map Configuration
export const MAP_CONFIG = {
  ZOOM: 13,
  FLY_DURATION: 1000,
  MIN_HEIGHT: 600,
  MIN_WIDTH: 400,
} as const;

// Supported locales for internationalization
export const SUPPORTED_LOCALES = [
  { code: "en", label: "English", enabled: true },
  { code: "de", label: "Deutsch", enabled: true },
  { code: "fr", label: "Français", enabled: false },
  { code: "es", label: "Español", enabled: false },
  { code: "ar", label: "العربية", enabled: false },
  { code: "tr", label: "Türkçe", enabled: false },
] as const;

// Default form values
export const DEFAULT_LOCATION_FORM = {
  name: "",
  address: "",
  city: "Berlin",
  country: "Germany",
  type: "food_bank" as const,
  dietary_restrictions: [] as string[],
  operating_hours: {} as Record<string, { open: string; close: string }>,
};

export const DEFAULT_FILTER_VALUES = {
  search: "",
  type: "",
  dietary_restrictions: [] as string[],
};

// Location utilities
export function getLatLng(center: any) {
  if (typeof center.location === "string") {
    return { lat: center.lat, lng: center.lng };
  }
  return center.location;
}

// Address parsing utility for Nominatim API responses
export function parseAddressFromNominatim(data: any) {
  if (data.address) {
    const addr = data.address;

    let address = "Current Location";
    if (addr.road) {
      address = addr.house_number
        ? `${addr.road} ${addr.house_number.toUpperCase()}`
        : addr.road;
    } else if (addr.suburb) {
      address = addr.suburb;
    }

    let city = "Berlin";
    let country = "Germany";
    let postcode = "";
    let district = "";

    const parts = data.display_name.split(", ");
    for (const part of parts) {
      if (part.match(/^\d{5}$/)) {
        postcode = part;
      } else if (["Berlin", "Hamburg", "München", "Köln"].includes(part)) {
        city = part;
      } else if (part.length > 2 && !postcode && !city) {
        district = part;
      }
    }

    if (addr.country) country = addr.country;

    return {
      address,
      city,
      country,
      postcode,
      district,
    };
  }

  return {
    address: "Current Location",
    city: "Berlin",
    country: "Germany",
    postcode: "",
    district: "",
  };
}
