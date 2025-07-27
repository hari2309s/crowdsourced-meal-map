import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import {
  type FoodCenter,
  AVAILABILITY_STATUS_VALUES,
  FOOD_CENTER_TYPE_VALUES,
} from "@crowdsourced-meal-map/shared";
import { type UserAddress } from "@/hooks/useLocation";

type LatLng = {
  lat: number;
  lng: number;
};

export function useMapMarkers({
  map,
  mapLoaded,
  foodCenters,
  userLocation,
  userAddress,
  selectedCenter,
  onSelectCenter,
  setPopupInfo,
}: {
  map: React.MutableRefObject<maplibregl.Map | null>;
  mapLoaded: boolean;
  foodCenters: FoodCenter[];
  userLocation: LatLng | null | undefined;
  userAddress: UserAddress | null;
  selectedCenter: FoodCenter | null;
  // eslint-disable-next-line no-unused-vars
  onSelectCenter: (center: FoodCenter | null) => void;
  setPopupInfo: (
    // eslint-disable-next-line no-unused-vars
    info: {
      type: "user" | "foodCenter";
      data:
        | FoodCenter
        | {
            location: LatLng;
            address: string;
            city: string;
            country: string;
          };
    } | null,
  ) => void;
}) {
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  function getLatLng(center: FoodCenter) {
    if (typeof center.location === "string") {
      return {
        lat: (center as unknown as { lat: number; lng: number }).lat,
        lng: (center as unknown as { lat: number; lng: number }).lng,
      };
    }
    return center.location;
  }

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    foodCenters.forEach((center) => {
      const loc = getLatLng(center);
      if (
        typeof loc?.lat === "number" &&
        typeof loc?.lng === "number" &&
        !isNaN(loc.lat) &&
        !isNaN(loc.lng)
      ) {
        // Create marker container for wave effect
        const markerContainer = document.createElement("div");
        markerContainer.className = "relative cursor-pointer";
        markerContainer.style.width = "16px";
        markerContainer.style.height = "16px";

        const el = document.createElement("div");
        //const availabilityColor = AVAILABILITY_STATUSES.find(
        //(status) => status.value === center.current_availability,
        //);
        const shouldPulse =
          center.current_availability ===
            AVAILABILITY_STATUS_VALUES.AVAILABLE ||
          center.current_availability === AVAILABILITY_STATUS_VALUES.LIMITED;

        el.className =
          "w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform relative z-10";

        // Use food center type color as background
        //const { bg } = getFoodCenterTypeColorClasses(center.type);
        // Convert Tailwind class to hex color for inline style
        // We'll use a simple mapping for now (should match the bg classes in getFoodCenterTypeColorClasses)
        const typeColorHex =
          center.type === FOOD_CENTER_TYPE_VALUES.FOOD_BANK
            ? "#2563eb" // blue-600
            : center.type === FOOD_CENTER_TYPE_VALUES.COMMUNITY_KITCHEN
              ? "#16a34a" // green-600
              : center.type === FOOD_CENTER_TYPE_VALUES.SOUP_KITCHEN
                ? "#fb923c" // orange-400
                : center.type === FOOD_CENTER_TYPE_VALUES.MOBILE_UNIT
                  ? "#a21caf" // purple-500
                  : center.type === FOOD_CENTER_TYPE_VALUES.PANTRY
                    ? "#e11d48" // rose-500
                    : "#e7e5e4"; // stone-200 (default)
        el.style.backgroundColor = typeColorHex;
        el.style.opacity = "1";

        // Add pulsating wave effect for available/limited centers
        if (shouldPulse) {
          for (let i = 0; i < 3; i++) {
            const wave = document.createElement("div");
            wave.className = "absolute rounded-full border-2";
            wave.style.top = "0";
            wave.style.left = "0";
            wave.style.width = "16px";
            wave.style.height = "16px";
            wave.style.borderColor = typeColorHex;
            wave.style.opacity = "0.4";
            wave.style.animation = `pulse-wave 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.3}s`;
            wave.style.pointerEvents = "none";
            markerContainer.appendChild(wave);
          }
        }

        markerContainer.appendChild(el);

        // Add CSS animation styles to document head if not already added
        if (!document.getElementById("pulse-wave-styles")) {
          const style = document.createElement("style");
          style.id = "pulse-wave-styles";
          style.textContent = `
            @keyframes pulse-wave {
              0% {
                transform: scale(1);
                opacity: 0.4;
              }
              50% {
                transform: scale(2.5);
                opacity: 0.1;
              }
              100% {
                transform: scale(3);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }

        markerContainer.onclick = () => {
          setPopupInfo(null);
          setTimeout(() => {
            setPopupInfo({ type: "foodCenter", data: center });
            onSelectCenter(center);
          }, 0);
        };

        const marker = new maplibregl.Marker({ element: markerContainer })
          .setLngLat([loc.lng, loc.lat])
          .addTo(map.current!);
        markersRef.current.push(marker);
      }
    });
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [
    foodCenters,
    mapLoaded,
    selectedCenter,
    onSelectCenter,
    setPopupInfo,
    map,
  ]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (
      userLocation &&
      typeof userLocation.lat === "number" &&
      typeof userLocation.lng === "number" &&
      !isNaN(userLocation.lat) &&
      !isNaN(userLocation.lng)
    ) {
      // Create user marker container for wave effect
      const userContainer = document.createElement("div");
      userContainer.className = "relative cursor-pointer";
      userContainer.style.width = "16px";
      userContainer.style.height = "16px";

      const el = document.createElement("div");
      el.className =
        "w-4 h-4 bg-stone-950 rounded-full border-2 border-white shadow-lg relative z-10 transition-transform";

      // Add subtle wave effect for user location
      for (let i = 0; i < 2; i++) {
        const wave = document.createElement("div");
        wave.className = "absolute rounded-full border-2";
        wave.style.top = "0";
        wave.style.left = "0";
        wave.style.width = "16px";
        wave.style.height = "16px";
        wave.style.borderColor = "#1c1917";
        wave.style.opacity = "0.2";
        wave.style.animation = `pulse-wave 3s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.5}s`;
        wave.style.pointerEvents = "none";
        userContainer.appendChild(wave);
      }

      userContainer.appendChild(el);
      userContainer.onclick = () => {
        setPopupInfo(null);
        setTimeout(() => {
          setPopupInfo({
            type: "user",
            data: {
              location: userLocation,
              address: userAddress?.address ?? "",
              city: userAddress?.city ?? "",
              country: userAddress?.country ?? "",
            },
          });
          onSelectCenter(null);
        }, 0);
      };
      userMarkerRef.current = new maplibregl.Marker({ element: userContainer })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current!);
    }

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
    };
  }, [userLocation, mapLoaded, userAddress, onSelectCenter, setPopupInfo, map]);
}
