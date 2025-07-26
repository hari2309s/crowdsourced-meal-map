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
  lat: 52.4991,
  lng: 13.4184,
}; // Kottbusser Tor, Berlin
