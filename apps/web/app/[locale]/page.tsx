"use client";

import { useState, useEffect } from "react";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFoodCenters() {
      try {
        console.log("Loading food centers with filters:", filters);
        const centers = await getFoodCenters({
          ...filters,
          verified: true,
        });
        console.log("Loaded food centers:", centers);
        setFoodCenters(centers);
        setError(null);
      } catch (error) {
        console.error("Error loading food centers:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    }

    loadFoodCenters();
  }, [filters]);

  console.log(
    "HomePage render - foodCenters:",
    foodCenters.length,
    "loading:",
    loading,
    "error:",
    error,
  );

  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-red-50">
          <div className="text-center max-w-md mx-auto p-6">
            <h2 className="text-xl font-bold text-red-800 mb-4">
              Database Connection Error
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <Map
            foodCenters={foodCenters}
            selectedCenter={selectedCenter}
            onSelectCenter={setSelectedCenter}
          />
        </div>
      </div>
    </div>
  );
}
