import { useState, useEffect, useCallback } from "react";

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface UserAddress {
  address: string;
  city: string;
  country: string;
}

const parseAddressFromNominatim = (data: any): UserAddress => {
  if (data.address) {
    const addr = data.address;

    let address = "Current Location";
    if (addr.road) {
      address = addr.house_number
        ? `${addr.road} ${addr.house_number.toUpperCase()}`
        : addr.road;
    } else if (addr.suburb) {
      address = addr.suburb;
    }

    const cityParts: string[] = [];

    if (addr.district) {
      cityParts.push(addr.district);
    } else if (addr.suburb && addr.suburb !== address) {
      cityParts.push(addr.suburb);
    }

    if (addr.postcode && (addr.city || addr.town || addr.village)) {
      const cityName = addr.city || addr.town || addr.village;
      cityParts.push(`${addr.postcode} ${cityName}`);
    } else if (addr.postcode) {
      cityParts.push(addr.postcode);
    } else if (addr.city || addr.town || addr.village) {
      cityParts.push(addr.city || addr.town || addr.village);
    }

    return {
      address,
      city: cityParts.join(", "),
      country: addr.country ?? "Unknown",
    };
  }

  if (data.display_name) {
    const addressParts = data.display_name.split(", ");
    const middleParts = addressParts.slice(1, -1);

    let postcode = "";
    let cityName = "";
    let district = "";

    for (const part of middleParts) {
      if (part.match(/^\d{5}$/)) {
        postcode = part;
      } else if (["Berlin", "Hamburg", "München", "Köln"].includes(part)) {
        cityName = part;
      } else if (part.length > 2 && !postcode && !cityName) {
        district = part;
      }
    }

    const cityParts: string[] = [];

    if (district) cityParts.push(district);

    if (postcode && cityName) {
      cityParts.push(`${postcode} ${cityName}`);
    } else if (postcode) {
      cityParts.push(postcode);
    } else if (cityName) {
      cityParts.push(cityName);
    }

    return {
      address: addressParts[0] ?? "Current Location",
      city: cityParts.join(", "),
      country: addressParts[addressParts.length - 1] ?? "Unknown",
    };
  }

  return {
    address: "Current Location",
    city: "Unknown",
    country: "Unknown",
  };
};

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
