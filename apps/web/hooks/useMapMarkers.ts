import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { FoodCenter } from "@crowdsourced-meal-map/shared";

interface LatLng {
  lat: number;
  lng: number;
}

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
  userAddress: any;
  selectedCenter: FoodCenter | null;
  onSelectCenter: (center: FoodCenter | null) => void;
  setPopupInfo: (info: any) => void;
}) {
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Helper to ensure we always get { lat, lng } from a center
  function getLatLng(center: any) {
    if (typeof center.location === "string") {
      return { lat: center.lat, lng: center.lng };
    }
    return center.location;
  }

  // Food center markers
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
        const el = document.createElement("div");
        el.className = `w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform ${
          selectedCenter?.id === center.id ? "animate-pulse" : ""
        }`;
        el.style.backgroundColor = "#f5f5f4";
        el.style.cursor = "pointer";
        el.innerHTML = `<svg class='w-3 h-3 text-white' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'/><circle cx='12' cy='9' r='2.5' fill='currentColor'/></svg>`;
        el.onclick = () => {
          setPopupInfo(null);
          setTimeout(() => {
            setPopupInfo({ type: "foodCenter", data: center });
            onSelectCenter(center);
          }, 0);
        };
        const marker = new maplibregl.Marker({ element: el })
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

  // User location marker
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
      const el = document.createElement("div");
      el.className =
        "w-4 h-4 bg-stone-950 rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer transition-transform";
      el.onclick = () => {
        setPopupInfo(null);
        setTimeout(() => {
          setPopupInfo({
            type: "user",
            data: {
              location: userLocation,
              address: userAddress?.address || "",
              city: userAddress?.city || "",
              country: userAddress?.country || "",
            },
          });
          onSelectCenter(null);
        }, 0);
      };
      userMarkerRef.current = new maplibregl.Marker({ element: el })
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
