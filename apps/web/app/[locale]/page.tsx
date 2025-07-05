"use client";

import { useState, useEffect } from "react";
import { MapComponent } from "../components/Map";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { getFoodCenters } from "@crowdsourced-meal-map/database";
import type { FoodCenter } from "@crowdsourced-meal-map/shared";

export default function HomePage() {
  const [foodCenters, setFoodCenters] = useState<FoodCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<FoodCenter | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    dietary_restrictions: [] as string[],
    city: "Berlin",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFoodCenters() {
      try {
        const centers = await getFoodCenters({
          ...filters,
          verified: true,
        });
        setFoodCenters(centers);
      } catch (error) {
        console.error("Error loading food centers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFoodCenters();
  }, [filters]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar
          foodCenters={foodCenters}
          selectedCenter={selectedCenter}
          onSelectCenter={setSelectedCenter}
          filters={filters}
          onFiltersChange={setFilters}
          loading={loading}
        />
        <div className="flex-1">
          <MapComponent
            foodCenters={foodCenters}
            selectedCenter={selectedCenter}
            onSelectCenter={setSelectedCenter}
          />
        </div>
      </div>
    </div>
  );
}
