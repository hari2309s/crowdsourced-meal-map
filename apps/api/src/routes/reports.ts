import { Router } from "express";
import { z } from "zod";
import { createUserReport } from "@repo/database";

export const reportRoutes = Router();

const reportSchema = z.object({
  food_center_id: z.string().optional(),
  reporter_id: z.string().optional(),
  type: z.string(),
  content: z.record(z.any()),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

reportRoutes.post("/", async (req, res) => {
  try {
    const data = reportSchema.parse(req.body);
    const report = await createUserReport(data);
    res.status(201).json(report);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create report" });
  }
});
