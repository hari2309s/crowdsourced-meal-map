import { useState, useEffect, useCallback } from "react";
import { parseAddressFromNominatim } from "@crowdsourced-meal-map/shared";

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface UserAddress {
  address: string;
  city: string;
  country: string;
  district?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [address, setAddress] = useState<UserAddress | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAddressFromCoordinates = useCallback(
    async (lat: number, lng: number) => {
      try {
        setLoading(true);
        setError(null);

        const url = `${process.env["NEXT_PUBLIC_NOMINATIM_BASE_URL"]}?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const parsedAddress = parseAddressFromNominatim(data);
        setAddress(parsedAddress);
      } catch (error) {
        console.error("Error getting address:", error);
        setError(
          error instanceof Error ? error.message : "Failed to get address",
        );
        setAddress({
          address: "Current Location",
          city: "Unknown",
          country: "Unknown",
          district: "",
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(userLoc);
        getAddressFromCoordinates(userLoc.lat, userLoc.lng);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError(`Location error: ${error.message}`);
        setLoading(false);
      },
    );
  }, [getAddressFromCoordinates]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);
  const updateLocation = useCallback(
    (newLocation: UserLocation) => {
      setLocation(newLocation);
      getAddressFromCoordinates(newLocation.lat, newLocation.lng);
    },
    [getAddressFromCoordinates],
  );

  const resetLocation = useCallback(() => {
    setLocation(null);
    setAddress(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    location,
    address,
    loading,
    error,
    getCurrentLocation,
    updateLocation,
    resetLocation,
    getAddressFromCoordinates,
  };
}
