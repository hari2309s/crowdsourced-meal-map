import "dotenv/config";
import express from "express";
import cors from "cors";
import { foodCenterRoutes } from "./routes/foodCenters";
import { availabilityRoutes } from "./routes/availability";
import { reviewRoutes } from "./routes/reviews";
import { reportRoutes } from "./routes/reports";

const app = express();
const port = process.env["PORT"] ?? 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK" });
});

// Routes
app.use("/api/food-centers", foodCenterRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
