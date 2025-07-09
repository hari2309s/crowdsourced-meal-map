import { Router, Request, Response } from "express";
import { z } from "zod";
import { createReview, getReviews } from "@crowdsourced-meal-map/database";

export const reviewRoutes: Router = Router();

const reviewSchema = z.object({
  food_center_id: z.string(),
  user_id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

reviewRoutes.get("/:foodCenterId", async (req: Request, res: Response) => {
  const foodCenterId = req.params["foodCenterId"];
  if (!foodCenterId) {
    res.status(400).json({ error: "Missing food center id" });
    return;
  }
  try {
    const reviews = await getReviews(foodCenterId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

reviewRoutes.post("/", async (req: any, res: any) => {
  try {
    const data = reviewSchema.parse(req.body);
    const review = await createReview({ ...data, comment: data.comment ?? "" });
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create review" });
  }
});
