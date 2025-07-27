import React, { useEffect, useState, type ReactNode } from "react";
import type maplibregl from "maplibre-gl";
import LocationPopup from "@/components/LocationPopup";

export function useMapPopup({
  map,
  popupInfo,
  setPopupInfo,
  userLocation,
}: {
  map: React.RefObject<maplibregl.Map | null>;
  popupInfo: { type: "user" | "foodCenter"; data: any } | null;
  setPopupInfo: (info: any) => void;
  userLocation?: { lat: number; lng: number } | null;
}) {
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [popupContent, setPopupContent] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (!map.current || !popupInfo) {
      setPopupPosition(null);
      setPopupContent(null);
      return;
    }

    let lng: number | undefined,
      lat: number | undefined,
      content: ReactNode | null = null;

    if (popupInfo.type === "user") {
      lng = popupInfo.data.location.lng;
      lat = popupInfo.data.location.lat;
      content = (
        <LocationPopup
          title="Your Location"
          address={popupInfo.data.address}
          city={popupInfo.data.city}
          country={popupInfo.data.country}
          coordinates={popupInfo.data.location}
          onClose={() => setPopupInfo(null)}
          foodCenter={undefined}
          userLocation={userLocation ?? null}
        />
      );
    } else if (popupInfo.type === "foodCenter") {
      const loc =
        typeof popupInfo.data.location === "string"
          ? { lat: popupInfo.data.lat, lng: popupInfo.data.lng }
          : popupInfo.data.location;
      lng = loc.lng;
      lat = loc.lat;
      content = (
        <LocationPopup
          title={popupInfo.data.name}
          address={popupInfo.data.address}
          city={popupInfo.data.city}
          country={popupInfo.data.country}
          coordinates={loc}
          onClose={() => setPopupInfo(null)}
          foodCenter={popupInfo.data}
          userLocation={userLocation ?? null}
        />
      );
    }

    if (lng !== undefined && lat !== undefined) {
      const point = map.current.project([lng, lat]);
      setPopupPosition({ x: point.x, y: point.y });
      setPopupContent(content);
    } else {
      setPopupPosition(null);
      setPopupContent(null);
    }

    const updatePosition = () => {
      if (!map.current || lng === undefined || lat === undefined) return;
      const point = map.current.project([lng, lat]);
      setPopupPosition({ x: point.x, y: point.y });
    };

    map.current.on("move", updatePosition);
    map.current.on("resize", updatePosition);

    return () => {
      map.current?.off("move", updatePosition);
      map.current?.off("resize", updatePosition);
    };
  }, [popupInfo, map, setPopupInfo, userLocation]);

  return { popupContent, popupPosition };
}
