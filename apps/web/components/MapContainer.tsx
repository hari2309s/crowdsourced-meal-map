import React from "react";

interface MapContainerProps {
  children: React.ReactNode;
  mapLoaded: boolean;
  mapError: string | null;
  minHeight: number;
  onRetry?: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  children,
  mapLoaded,
  mapError,
  minHeight,
  onRetry,
}) => {
  if (mapError) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center bg-stone-100 rounded-lg"
        style={{ minHeight }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">Map Error: {mapError}</p>
          <button
            onClick={onRetry}
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
      style={{ minHeight }}
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
      {children}
    </div>
  );
};

export default MapContainer;
