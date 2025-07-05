export type FoodCenterType =
  | "food_bank"
  | "community_kitchen"
  | "soup_kitchen"
  | "mobile_unit"
  | "pantry";
export type DietaryRestriction =
  | "vegetarian"
  | "vegan"
  | "halal"
  | "kosher"
  | "gluten_free"
  | "dairy_free"
  | "nut_free";
export type AvailabilityStatus =
  | "available"
  | "limited"
  | "unavailable"
  | "unknown";
export type UserRole = "user" | "moderator" | "admin";
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}
export interface FoodCenter {
  id: string;
  name: string;
  description?: string;
  type: FoodCenterType;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  location: {
    lat: number;
    lng: number;
  };
  operating_hours?: Record<
    string,
    {
      open: string;
      close: string;
    }
  >;
  dietary_restrictions?: DietaryRestriction[];
  contact_person?: string;
  languages_spoken?: string[];
  capacity?: number;
  current_availability: AvailabilityStatus;
  verified: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
export interface AvailabilityUpdate {
  id: string;
  food_center_id: string;
  status: AvailabilityStatus;
  notes?: string;
  reported_by?: string;
  created_at: string;
}
export interface UserReport {
  id: string;
  food_center_id?: string;
  reporter_id?: string;
  type: string;
  content: Record<string, any>;
  status: "pending" | "approved" | "rejected";
  moderated_by?: string;
  moderated_at?: string;
  created_at: string;
}
export interface Review {
  id: string;
  food_center_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}
//# sourceMappingURL=types.d.ts.map
