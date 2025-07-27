import * as z from "zod";
import {
  FOOD_CENTER_TYPE_VALUES,
  AVAILABILITY_STATUS_VALUES,
} from "./constants";

// Location/Food Center Schema
export const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().default("Berlin"),
  country: z.string().default("Germany"),
  postal_code: z.string().optional(),
  district: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  type: z.enum([
    FOOD_CENTER_TYPE_VALUES.FOOD_BANK,
    FOOD_CENTER_TYPE_VALUES.COMMUNITY_KITCHEN,
    FOOD_CENTER_TYPE_VALUES.SOUP_KITCHEN,
    FOOD_CENTER_TYPE_VALUES.MOBILE_UNIT,
    FOOD_CENTER_TYPE_VALUES.PANTRY,
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
  status: z.enum([
    AVAILABILITY_STATUS_VALUES.AVAILABLE,
    AVAILABILITY_STATUS_VALUES.LIMITED,
    AVAILABILITY_STATUS_VALUES.UNAVAILABLE,
    AVAILABILITY_STATUS_VALUES.UNKNOWN,
  ]),
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
