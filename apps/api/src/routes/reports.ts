import { Router } from "express";
import { z } from "zod";
import { createUserReport } from "@crowdsourced-meal-map/database";

export const reportRoutes: Router = Router();

const reportSchema = z.object({
  food_center_id: z.string().optional(),
  reporter_id: z.string().optional(),
  type: z.string(),
  content: z.record(z.any()),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

reportRoutes.post("/", async (req: any, res: any) => {
  try {
    const data = reportSchema.parse(req.body);
    const report = await createUserReport({
      ...data,
      food_center_id: data.food_center_id ?? "",
      reporter_id: data.reporter_id ?? "",
    });
    res.status(201).json(report);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create report" });
  }
});
