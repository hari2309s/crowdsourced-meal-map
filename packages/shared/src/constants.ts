export const FOOD_CENTER_TYPES = [
  { value: "food_bank", label: "Food Bank" },
  { value: "community_kitchen", label: "Community Kitchen" },
  { value: "soup_kitchen", label: "Soup Kitchen" },
  { value: "mobile_unit", label: "Mobile Unit" },
  { value: "pantry", label: "Pantry" },
] as const;

export const DIETARY_RESTRICTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
  { value: "nut_free", label: "Nut Free" },
] as const;

export const AVAILABILITY_STATUSES = [
  { value: "available", label: "Available", color: "green" },
  { value: "limited", label: "Limited", color: "yellow" },
  { value: "unavailable", label: "Unavailable", color: "red" },
  { value: "unknown", label: "Unknown", color: "gray" },
] as const;

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
}; // Berlin center
