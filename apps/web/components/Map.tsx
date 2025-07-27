"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Navigation, Plus, Minus } from "lucide-react";
import {
  DEFAULT_MAP_CENTER,
  calculateBoundsAroundLocation,
  MAP_CONFIG,
  getLatLng,
  type FoodCenter,
} from "@crowdsourced-meal-map/shared";
import { useLocation, type UserLocation } from "@/hooks/useLocation";
import { useMapLibre } from "@/hooks/useMapLibre";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { useMapPopup } from "@/hooks/useMapPopup";
import MapContainer from "@/components/MapContainer";

const Map = ({
  foodCenters,
  selectedCenter,
  onSelectCenter,
}: {
  foodCenters: FoodCenter[];
  selectedCenter: FoodCenter | null;
  // eslint-disable-next-line no-unused-vars
  onSelectCenter: (_: FoodCenter | null) => void;
}) => {
  const { location: userLocation, address: userAddress } = useLocation();

  const initialCenter = useMemo(
    () => userLocation ?? DEFAULT_MAP_CENTER,
    [userLocation],
  );

  const dynamicBounds = useMemo(
    () => calculateBoundsAroundLocation(initialCenter, 5),
    [initialCenter],
  );

  const { mapContainer, map, mapLoaded, mapError, minHeight, minWidth } =
    useMapLibre(
      initialCenter,
      MAP_CONFIG.ZOOM,
      MAP_CONFIG.MIN_HEIGHT,
      MAP_CONFIG.MIN_WIDTH,
      dynamicBounds,
    );

  const [popupInfo, setPopupInfo] = useState<{
    type: "user" | "foodCenter";
    data:
      | FoodCenter
      | {
          location: { lat: number; lng: number };
          address: string;
          city: string;
          country: string;
        };
  } | null>(null);

  useMapMarkers({
    map,
    mapLoaded,
    foodCenters,
    userLocation,
    userAddress,
    selectedCenter,
    onSelectCenter,
    setPopupInfo,
  });

  const { popupContent, popupPosition } = useMapPopup({
    map,
    popupInfo,
    setPopupInfo,
    userLocation,
  });

  const flyToLocation = useCallback(
    (location: UserLocation) => {
      if (
        map.current &&
        typeof location.lat === "number" &&
        typeof location.lng === "number" &&
        !isNaN(location.lat) &&
        !isNaN(location.lng)
      ) {
        map.current.flyTo({
          center: [location.lng, location.lat],
          zoom: MAP_CONFIG.ZOOM,
          duration: MAP_CONFIG.FLY_DURATION,
        });
      } else {
        console.warn("Invalid location for flyTo:", location);
      }
    },
    [map],
  );

  useEffect(() => {
    if (selectedCenter && map.current) {
      const loc = getLatLng(selectedCenter);
      flyToLocation(loc);
      setPopupInfo({
        type: "foodCenter",
        data: selectedCenter,
      });
    }
  }, [selectedCenter, flyToLocation, map]);

  const navigateToUserLocation = useCallback(() => {
    if (userLocation) {
      flyToLocation(userLocation);
    }
  }, [userLocation, flyToLocation]);

  const zoomIn = useCallback(() => {
    if (map.current) {
      const currentZoom = map.current.getZoom();
      map.current.setZoom(currentZoom + 1);
    }
  }, [map]);

  const zoomOut = useCallback(() => {
    if (map.current) {
      const currentZoom = map.current.getZoom();
      map.current.setZoom(currentZoom - 1);
    }
  }, [map]);

  if (mapError) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center bg-stone-100 rounded-lg"
        style={{ minHeight }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">Map Error: {mapError}</p>
          <button
            className="px-4 py-2 bg-stone-500 text-stone-950 rounded hover:bg-stone-600 transition-colors"
            onClick={() => {}}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      mapLoaded={mapLoaded}
      mapError={mapError}
      minHeight={minHeight}
    >
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${minHeight}px`,
          minHeight: `${minHeight}px`,
          minWidth: `${minWidth}px`,
          background: "#eee",
          zIndex: 1,
          border: "1px dashed #ccc",
          borderRadius: "8px",
          padding: "5px",
        }}
      />
      {popupContent && popupPosition && (
        <div
          style={{
            position: "absolute",
            left: popupPosition.x,
            top: popupPosition.y - 40,
            transform: "translate(-50%, -100%)",
            zIndex: 100,
            pointerEvents: "auto",
          }}
        >
          {popupContent}
        </div>
      )}
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
      <div className="absolute bottom-4 left-4 flex flex-col space-y-1 z-50">
        <button
          onClick={zoomIn}
          className="bg-white border border-dashed border-stone-300 hover:bg-stone-50 w-8 h-8 flex items-center justify-center rounded-md shadow-sm transition-colors cursor-pointer"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4 text-stone-700" />
        </button>
        <button
          onClick={zoomOut}
          className="bg-white border border-dashed border-stone-300 hover:bg-stone-50 w-8 h-8 flex items-center justify-center rounded-md shadow-sm transition-colors cursor-pointer"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4 text-stone-700" />
        </button>
      </div>
    </MapContainer>
  );
};

export default Map;
