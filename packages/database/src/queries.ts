import { supabase } from "./client";
import type {
  FoodCenter,
  AvailabilityUpdate,
  UserReport,
  Review,
} from "@crowdsourced-meal-map/shared";

export async function getFoodCenters(filters?: {
  type?: string;
  dietary_restrictions?: string[];
  city?: string;
  verified?: boolean;
}) {
  let query = supabase
    .from("food_centers")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.city) {
    query = query.eq("city", filters.city);
  }

  if (filters?.verified !== undefined) {
    query = query.eq("verified", filters.verified);
  }

  if (
    filters?.dietary_restrictions &&
    filters.dietary_restrictions.length > 0
  ) {
    query = query.overlaps(
      "dietary_restrictions",
      filters.dietary_restrictions,
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as FoodCenter[];
}

export async function getNearbyFoodCenters(
  lat: number,
  lng: number,
  radiusMeters: number = 5000,
) {
  const { data, error } = await supabase.rpc("get_nearby_food_centers", {
    lat,
    lng,
    radius_meters: radiusMeters,
  });

  if (error) throw error;
  return data;
}

export async function getFoodCenterById(id: string) {
  const { data, error } = await supabase
    .from("food_centers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as FoodCenter;
}

export async function createFoodCenter(
  foodCenter: Omit<FoodCenter, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("food_centers")
    .insert([
      {
        ...foodCenter,
        location: `POINT(${foodCenter["location"].lng} ${foodCenter["location"].lat})`,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as FoodCenter;
}

export async function updateFoodCenter(
  id: string,
  updates: Partial<FoodCenter>,
) {
  const { data, error } = await supabase
    .from("food_centers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as FoodCenter;
}

export type CreateAvailabilityUpdateInput = Omit<
  AvailabilityUpdate,
  "id" | "created_at" | "notes"
> & {
  notes?: string | null;
};

export async function createAvailabilityUpdate(
  update: CreateAvailabilityUpdateInput,
): Promise<AvailabilityUpdate> {
  // Ensure notes is a string (convert null to empty string)
  const updateData: Omit<AvailabilityUpdate, "id" | "created_at"> = {
    ...update,
    notes: update.notes ?? "",
  };

  const { data, error } = await supabase
    .from("availability_updates")
    .insert([updateData])
    .select()
    .single();

  if (error) throw error;
  return data as AvailabilityUpdate;
}

export async function getAvailabilityUpdates(foodCenterId: string) {
  const { data, error } = await supabase
    .from("availability_updates")
    .select("*")
    .eq("food_center_id", foodCenterId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as AvailabilityUpdate[];
}

export async function createUserReport(
  report: Omit<UserReport, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("user_reports")
    .insert([report])
    .select()
    .single();

  if (error) throw error;
  return data as UserReport;
}

export async function getReviews(foodCenterId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("food_center_id", foodCenterId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createReview(
  review: Omit<Review, "id" | "created_at" | "updated_at" | "helpful_count">,
) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([review])
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}
