import { useRef, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";

type LatLng = {
  lat: number;
  lng: number;
};

type Bounds = {
  southwest: LatLng;
  northeast: LatLng;
};

export function useMapLibre(
  initialCenter: LatLng,
  zoom = 15,
  minHeight = 600,
  minWidth = 400,
  bounds?: Bounds,
) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [containerReady, setContainerReady] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const checkSize = () => {
      const el = mapContainer.current as unknown as HTMLElement;
      if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
        setContainerReady(true);
      }
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (map.current || !containerReady || !mapContainer.current) return;
    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [initialCenter.lng, initialCenter.lat],
        zoom,
      });
      map.current.on("load", () => {
        // If bounds are provided, fit the map to those bounds on initial load
        if (bounds && map.current) {
          map.current.fitBounds(
            [
              [bounds.southwest.lng, bounds.southwest.lat],
              [bounds.northeast.lng, bounds.northeast.lat],
            ],
            {
              padding: 20,
              duration: 0, // No animation on initial load
            },
          );
        }
        setMapLoaded(true);
        setMapError(null);
      });
      map.current.on("error", (e) => {
        setMapError(e.error?.message ?? "Failed to load map");
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
  }, [containerReady, initialCenter, zoom]);

  return { mapContainer, map, mapLoaded, mapError, minHeight, minWidth };
}
