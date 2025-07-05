import { Router } from "express";
import { z } from "zod";
import {
  createAvailabilityUpdate,
  getAvailabilityUpdates,
} from "@repo/database";

export const availabilityRoutes = Router();

const availabilitySchema = z.object({
  food_center_id: z.string(),
  status: z.enum(["available", "limited", "unavailable", "unknown"]),
  notes: z.string().optional(),
  reported_by: z.string().optional(),
});

availabilityRoutes.get("/:foodCenterId", async (req, res) => {
  try {
    const updates = await getAvailabilityUpdates(req.params.foodCenterId);
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch availability updates" });
  }
});

availabilityRoutes.post("/", async (req, res) => {
  try {
    const data = availabilitySchema.parse(req.body);
    const update = await createAvailabilityUpdate(data);
    res.status(201).json(update);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create availability update" });
  }
});
