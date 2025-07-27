import { Router, type Request, type Response } from "express";
import { z } from "zod";
import {
  createAvailabilityUpdate,
  getAvailabilityUpdates,
} from "@crowdsourced-meal-map/database";
import { AVAILABILITY_STATUS_VALUES } from "@crowdsourced-meal-map/shared";

export const availabilityRoutes: Router = Router();

const availabilitySchema = z.object({
  food_center_id: z.string(),
  status: z.enum([
    AVAILABILITY_STATUS_VALUES.AVAILABLE,
    AVAILABILITY_STATUS_VALUES.LIMITED,
    AVAILABILITY_STATUS_VALUES.UNAVAILABLE,
    AVAILABILITY_STATUS_VALUES.UNKNOWN,
  ]),
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

availabilityRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const data = availabilitySchema.parse(req.body);
    const update = await createAvailabilityUpdate({
      ...data,
      notes: data.notes ?? "",
      reported_by: data.reported_by ?? "",
    });
    res.status(201).json(update);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Failed to create availability update" });
  }
});
