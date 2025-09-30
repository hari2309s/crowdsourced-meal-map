"use client";

import React, { useState, useEffect } from "react";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getFoodCenters } from "@crowdsourced-meal-map/database";
import { type FoodCenter, sortByDistance } from "@crowdsourced-meal-map/shared";
import { motion } from "framer-motion";
import { useLocation } from "@/hooks/useLocation";

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
      className="w-screen flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />
      <div className="flex flex-col items-center justify-center w-[90%] py-4 md:flex-row">
        <Sidebar
          foodCenters={sortedCenters}
          selectedCenter={selectedCenter}
          onSelectCenter={setSelectedCenter}
          filters={filters}
          onFiltersChange={setFilters}
          loading={loading}
          userLocation={userLocation}
        />
        <div className="flex flex-1 justify-center items-center py-4 px-0 md:pl-4 w-full ">
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
