"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Navigation } from "lucide-react";
import {
  DEFAULT_MAP_CENTER,
  getStatusColor,
  type FoodCenter,
} from "@crowdsourced-meal-map/shared";
import LocationPopup from "@/components/LocationPopup";
import { useLocation, type UserLocation } from "@/hooks/useLocation";

// Constants
const MAP_CONFIG = {
  ZOOM: 15,
  FLY_DURATION: 1000,
  MIN_HEIGHT: 600,
  MIN_WIDTH: 400,
} as const;

// Types
interface PopupInfo {
  type: "user" | "foodCenter";
  data:
    | FoodCenter
    | {
        title: string;
        address: string;
        city: string;
        country: string;
        coordinates: UserLocation;
      };
}

interface MapProps {
  foodCenters: FoodCenter[];
  selectedCenter: FoodCenter | null;
  onSelectCenter: (center: FoodCenter | null) => void;
}

const Map = ({ foodCenters, selectedCenter, onSelectCenter }: MapProps) => {
  // Refs
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Location hook
  const { location: userLocation, address: userAddress } = useLocation();

  // State
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [containerReady, setContainerReady] = useState(false);

  // Memoized values
  const initialCenter = useMemo(
    () => userLocation || DEFAULT_MAP_CENTER,
    [userLocation],
  );

  // Map fly to function
  const flyToLocation = useCallback((location: UserLocation) => {
    if (map.current) {
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: MAP_CONFIG.ZOOM,
        duration: MAP_CONFIG.FLY_DURATION,
      });
    }
  }, []);

  // Fly to selected center
  useEffect(() => {
    if (selectedCenter && map.current) {
      flyToLocation(selectedCenter.location);
      setPopupInfo({
        type: "foodCenter",
        data: selectedCenter,
      });
    }
  }, [selectedCenter, flyToLocation]);

  // Container size check
  useEffect(() => {
    if (!mapContainer.current) return;

    const checkSize = () => {
      const el = mapContainer.current;
      if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
        setContainerReady(true);
      }
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Initialize map
  useEffect(() => {
    if (map.current || !containerReady || !mapContainer.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [initialCenter.lng, initialCenter.lat],
        zoom: MAP_CONFIG.ZOOM,
      });

      map.current.on("load", () => {
        setMapLoaded(true);
        setMapError(null);
      });

      map.current.on("error", (e) => {
        setMapError(e.error?.message || "Failed to load map");
      });
    } catch (error) {
      setMapError(
        error instanceof Error ? error.message : "Failed to create map",
      );
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [containerReady, initialCenter]);

  // Handle user location updates after map is loaded
  useEffect(() => {
    if (userLocation && map.current && mapLoaded) {
      flyToLocation(userLocation);
    }
  }, [userLocation, mapLoaded, flyToLocation]);

  // Event handlers
  const handleMarkerClick = useCallback(
    (center: FoodCenter) => {
      setPopupInfo({
        type: "foodCenter",
        data: center,
      });
      onSelectCenter(center);
    },
    [onSelectCenter],
  );

  const handleUserLocationClick = useCallback(() => {
    if (!userLocation) return;

    const address =
      userAddress?.address && userAddress.address !== "Current Location"
        ? userAddress.address
        : `Coordinates: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`;

    const city =
      userAddress?.city && userAddress.city !== "Unknown"
        ? userAddress.city
        : "Location";

    const country =
      userAddress?.country && userAddress.country !== "Unknown"
        ? userAddress.country
        : "Unknown";

    setPopupInfo({
      type: "user",
      data: {
        title: "Your Location",
        address,
        city,
        country,
        coordinates: userLocation,
      },
    });
  }, [userLocation, userAddress]);

  const navigateToUserLocation = useCallback(() => {
    if (userLocation) {
      flyToLocation(userLocation);
    }
  }, [userLocation, flyToLocation]);

  const handlePopupClose = useCallback(() => {
    setPopupInfo(null);
    if (popupInfo?.type === "foodCenter") {
      onSelectCenter(null);
    }
  }, [popupInfo, onSelectCenter]);

  // Helper function to extract popup data
  const getPopupData = useCallback((popupInfo: PopupInfo) => {
    if (popupInfo.type === "foodCenter") {
      const foodCenter = popupInfo.data as FoodCenter;
      return {
        title: foodCenter.name,
        address: foodCenter.address,
        city: foodCenter.city,
        country: foodCenter.country,
        coordinates: foodCenter.location,
        foodCenter: foodCenter,
      };
    } else {
      const userData = popupInfo.data as {
        title: string;
        address: string;
        city: string;
        country: string;
        coordinates: UserLocation;
      };
      return {
        title: userData.title,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        coordinates: userData.coordinates,
        foodCenter: undefined,
      };
    }
  }, []);

  // Error state
  if (mapError) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center bg-stone-100 rounded-lg"
        style={{ minHeight: MAP_CONFIG.MIN_HEIGHT }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">Map Error: {mapError}</p>
          <button
            onClick={() => setMapError(null)}
            className="px-4 py-2 bg-stone-500 text-stone-950 rounded hover:bg-stone-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full min-h-[500px] bg-stone-100 rounded-lg"
      style={{ minHeight: MAP_CONFIG.MIN_HEIGHT }}
    >
      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 z-40">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Loading MapLibre GL...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-500 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${MAP_CONFIG.MIN_HEIGHT}px`,
          minHeight: `${MAP_CONFIG.MIN_HEIGHT}px`,
          minWidth: `${MAP_CONFIG.MIN_WIDTH}px`,
          background: "#eee",
          zIndex: 1,
          border: "1px dashed #ccc",
          borderRadius: "8px",
          padding: "5px",
        }}
      />

      {/* User Location Marker */}
      {userLocation && mapLoaded && (
        <div
          className="absolute z-20 w-4 h-4 bg-stone-950 rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer hover:scale-110 transition-transform"
          onClick={handleUserLocationClick}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            marginLeft: "0px",
            marginTop: "0px",
          }}
        />
      )}

      {/* Food Center Markers */}
      {mapLoaded &&
        foodCenters.map((center) => (
          <div
            key={center.id}
            className="absolute z-20 cursor-pointer"
            onClick={() => handleMarkerClick(center)}
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              marginLeft: "0px",
              marginTop: "0px",
            }}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${
                selectedCenter?.id === center.id ? "animate-pulse" : ""
              }`}
              style={{
                backgroundColor: getStatusColor(center.current_availability),
              }}
            >
              <MapPin className="w-3 h-3 text-white" />
            </div>
          </div>
        ))}

      {/* Popup */}
      {popupInfo && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          {(() => {
            const popupData = getPopupData(popupInfo);
            return (
              <LocationPopup
                title={popupData.title}
                address={popupData.address}
                city={popupData.city}
                country={popupData.country}
                coordinates={popupData.coordinates}
                onClose={handlePopupClose}
                foodCenter={popupData.foodCenter}
              />
            );
          })()}
        </div>
      )}

      {/* Navigation Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-50">
        {userLocation && (
          <button
            onClick={navigateToUserLocation}
            className="btn btn-secondary btn-sm"
            aria-label="Navigate to user location"
          >
            <Navigation className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Map;
