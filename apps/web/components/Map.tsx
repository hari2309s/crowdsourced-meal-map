"use client";

import { useRef, useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import { MapPin, Navigation } from "lucide-react";
import type { FoodCenter } from "@repo/shared";
import { DEFAULT_MAP_CENTER, getStatusColor } from "@repo/shared";
import { FoodCenterPopup } from "./FoodCenterPopup";

interface MapComponentProps {
  foodCenters: FoodCenter[];
  selectedCenter: FoodCenter | null;
  onSelectCenter: (center: FoodCenter | null) => void;
}

export function MapComponent({
  foodCenters,
  selectedCenter,
  onSelectCenter,
}: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [popupInfo, setPopupInfo] = useState<FoodCenter | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, []);

  useEffect(() => {
    if (selectedCenter && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedCenter.location.lng, selectedCenter.location.lat],
        zoom: 15,
        duration: 1000,
      });
      setPopupInfo(selectedCenter);
    }
  }, [selectedCenter]);

  const handleMarkerClick = (center: FoodCenter) => {
    setPopupInfo(center);
    onSelectCenter(center);
  };

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: userLocation?.lng || DEFAULT_MAP_CENTER.lng,
          latitude: userLocation?.lat || DEFAULT_MAP_CENTER.lat,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.stadiamaps.com/styles/stamen_toner_lite.json"
        attributionControl={false}
      >
        {userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
            anchor="center"
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </Marker>
        )}

        {foodCenters.map((center) => (
          <Marker
            key={center.id}
            longitude={center.location.lng}
            latitude={center.location.lat}
            anchor="bottom"
            onClick={() => handleMarkerClick(center)}
          >
            <div className="relative cursor-pointer">
              <div
                className={`p-2 rounded-full shadow-lg ${getStatusColor(center.current_availability)}`}
              >
                <MapPin className="h-5 w-5" />
              </div>
              {selectedCenter?.id === center.id && (
                <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-primary-600 rounded-full animate-pulse"></div>
              )}
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.location.lng}
            latitude={popupInfo.location.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="min-w-64"
          >
            <FoodCenterPopup
              center={popupInfo}
              onClose={() => setPopupInfo(null)}
            />
          </Popup>
        )}
      </Map>

      <div className="absolute top-4 right-4 space-y-2">
        {userLocation && (
          <button
            onClick={() => {
              mapRef.current?.flyTo({
                center: [userLocation.lng, userLocation.lat],
                zoom: 15,
                duration: 1000,
              });
            }}
            className="btn btn-secondary btn-sm"
          >
            <Navigation className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
