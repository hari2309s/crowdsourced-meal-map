import { Router } from "express";
import { z } from "zod";
import {
  createFoodCenter,
  getFoodCenters,
  getFoodCenterById,
  updateFoodCenter,
} from "@repo/database";
import type { FoodCenter } from "@repo/shared";

export const foodCenterRoutes = Router();

const foodCenterSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum([
    "food_bank",
    "community_kitchen",
    "soup_kitchen",
    "mobile_unit",
    "pantry",
  ]),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  operating_hours: z
    .record(z.object({ open: z.string(), close: z.string() }))
    .optional(),
  dietary_restrictions: z.array(z.string()).optional(),
  contact_person: z.string().optional(),
  languages_spoken: z.array(z.string()).optional(),
  capacity: z.number().optional(),
  current_availability: z
    .enum(["available", "limited", "unavailable", "unknown"])
    .default("unknown"),
  verified: z.boolean().default(false),
  created_by: z.string().optional(),
});

foodCenterRoutes.get("/", async (req, res) => {
  try {
    const filters = {
      type: req.query.type as string,
      dietary_restrictions: req.query.dietary_restrictions
        ? (req.query.dietary_restrictions as string).split(",")
        : undefined,
      city: req.query.city as string,
      verified:
        req.query.verified === "true"
          ? true
          : req.query.verified === "false"
            ? false
            : undefined,
    };
    const foodCenters = await getFoodCenters(filters);
    res.json(foodCenters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food centers" });
  }
});

foodCenterRoutes.get("/:id", async (req, res) => {
  try {
    const foodCenter = await getFoodCenterById(req.params.id);
    if (!foodCenter) {
      return res.status(404).json({ error: "Food center not found" });
    }
    res.json(foodCenter);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food center" });
  }
});

foodCenterRoutes.post("/", async (req, res) => {
  try {
    const data = foodCenterSchema.parse(req.body);
    const foodCenter = await createFoodCenter(data);
    res.status(201).json(foodCenter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create food center" });
  }
});

foodCenterRoutes.put("/:id", async (req, res) => {
  try {
    const data = foodCenterSchema.partial().parse(req.body);
    const foodCenter = await updateFoodCenter(req.params.id, data);
    res.json(foodCenter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to update food center" });
  }
});
