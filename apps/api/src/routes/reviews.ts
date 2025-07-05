import { Router } from "express";
import { z } from "zod";
import { createReview, getReviews } from "@crowdsourced-meal-map/database";

export const reviewRoutes = Router();

const reviewSchema = z.object({
  food_center_id: z.string(),
  user_id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

reviewRoutes.get("/:foodCenterId", async (req, res) => {
  try {
    const reviews = await getReviews(req.params.foodCenterId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

reviewRoutes.post("/", async (req, res) => {
  try {
    const data = reviewSchema.parse(req.body);
    const review = await createReview({ ...data, helpful_count: 0 });
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create review" });
  }
});
