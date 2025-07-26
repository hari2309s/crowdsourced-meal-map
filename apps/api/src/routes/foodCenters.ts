import { Router, type Request, type Response } from "express";
import { z } from "zod";
import {
  createFoodCenter,
  getFoodCenters,
  getFoodCenterById,
  updateFoodCenter,
} from "@crowdsourced-meal-map/database";
import {
  DietaryRestriction,
  removeUndefined,
  FoodCenter,
} from "@crowdsourced-meal-map/shared";

export const foodCenterRoutes: Router = Router();

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
    const filters: any = {
      type: req.query["type"] as string,
      dietary_restrictions: req.query["dietary_restrictions"]
        ? (req.query["dietary_restrictions"] as string).split(",")
        : [],
      city: req.query["city"] as string,
    };
    const verified =
      req.query["verified"] === "true"
        ? true
        : req.query["verified"] === "false"
          ? false
          : undefined;
    if (verified !== undefined) {
      filters.verified = verified;
    }
    const foodCenters = await getFoodCenters(filters);
    res.json(foodCenters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food centers" });
  }
});

foodCenterRoutes.get("/:id", async (req: Request, res: Response) => {
  const id = req.params["id"];
  if (!id) {
    res.status(400).json({ error: "Missing food center id" });
    return;
  }
  try {
    const foodCenter = await getFoodCenterById(id);
    if (!foodCenter) {
      res.status(404).json({ error: "Food center not found" });
      return;
    }
    res.json(foodCenter);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food center" });
  }
});

foodCenterRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const data = foodCenterSchema.parse(req.body);
    const foodCenter = await createFoodCenter({
      ...data,
      description: data.description ?? "",
      postal_code: data.postal_code ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      website: data.website ?? "",
      contact_person: data.contact_person ?? "",
      operating_hours: data.operating_hours ?? {},
      dietary_restrictions: (data.dietary_restrictions ??
        []) as DietaryRestriction[],
      languages_spoken: data.languages_spoken ?? [],
      capacity: data.capacity ?? 0,
      created_by: data.created_by ?? "",
    });
    res.status(201).json(foodCenter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Failed to create food center" });
  }
});

foodCenterRoutes.put("/:id", async (req: Request, res: Response) => {
  const id = req.params["id"];
  if (!id) {
    res.status(400).json({ error: "Missing food center id" });
    return;
  }
  try {
    const data = foodCenterSchema.partial().parse(req.body);
    const cleanedData = removeUndefined(data);
    const requiredStringFields = [
      "name",
      "description",
      "type",
      "address",
      "city",
      "country",
      "postal_code",
      "phone",
      "email",
      "website",
      "contact_person",
      "created_by",
    ];
    for (const field of requiredStringFields) {
      if ((cleanedData as Record<string, unknown>)[field] === undefined) {
        delete (cleanedData as Record<string, unknown>)[field];
      }
    }
    const foodCenter = await updateFoodCenter(
      id,
      cleanedData as Partial<FoodCenter>,
    );
    res.json(foodCenter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Failed to update food center" });
  }
});
