import * as z from "zod";

// Location/Food Center Schema
export const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().default("Berlin"),
  country: z.string().default("Germany"),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  type: z.enum([
    "food_bank",
    "community_kitchen",
    "soup_kitchen",
    "mobile_unit",
    "pantry",
  ]),
  dietary_restrictions: z.array(z.string()).default([]),
  operating_hours: z
    .record(
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    )
    .default({}),
  description: z.string().optional(),
  capacity: z.number().optional(),
  requirements: z.string().optional(),
  languages: z.array(z.string()).default([]),
  accessibility: z.boolean().default(false),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Review Schema
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// Availability Schema
export const availabilitySchema = z.object({
  status: z.enum(["available", "limited", "unavailable", "unknown"]),
  notes: z.string().optional(),
});

// Filter Schema
export const filterSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  dietary_restrictions: z.array(z.string()).optional(),
});

// Type exports
export type LocationForm = z.infer<typeof locationSchema>;
export type ReviewForm = z.infer<typeof reviewSchema>;
export type AvailabilityForm = z.infer<typeof availabilitySchema>;
export type FilterForm = z.infer<typeof filterSchema>;
