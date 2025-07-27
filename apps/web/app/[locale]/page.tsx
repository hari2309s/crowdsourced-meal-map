"use client";

import React, { useState, useEffect } from "react";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getFoodCenters } from "@crowdsourced-meal-map/database";
import type { FoodCenter } from "@crowdsourced-meal-map/shared";
import { motion } from "framer-motion";
import { useLocation } from "@/hooks/useLocation";
import { sortByDistance } from "@crowdsourced-meal-map/shared";

export default function HomePage() {
  const [foodCenters, setFoodCenters] = useState<FoodCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<FoodCenter | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    dietary_restrictions: [] as string[],
    city: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { location: userLocation } = useLocation();
  const sortedCenters = sortByDistance(foodCenters, userLocation);

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
    <motion.div
      className="h-screen w-screen flex flex-col items-center justify-center bg-stone-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />
      <div className="flex-1 flex items-center justify-center w-[90%] py-4">
        <Sidebar
          foodCenters={sortedCenters}
          selectedCenter={selectedCenter}
          onSelectCenter={setSelectedCenter}
          filters={filters}
          onFiltersChange={setFilters}
          loading={loading}
          userLocation={userLocation}
        />
        <div className="flex-1 py-4 pl-4 pr-0">
          <Map
            foodCenters={foodCenters}
            selectedCenter={selectedCenter}
            onSelectCenter={setSelectedCenter}
          />
        </div>
      </div>
    </motion.div>
  );
}
