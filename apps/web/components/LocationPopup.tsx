"use client";

import { X, MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import type { FoodCenter } from "@crowdsourced-meal-map/shared";

interface LocationPopupProps {
  title: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  onClose: () => void;
  // Optional food center specific data
  foodCenter?: FoodCenter | undefined;
}

const LocationPopup = ({
  title,
  address,
  city,
  country,
  coordinates,
  onClose,
  foodCenter,
}: LocationPopupProps) => {
  const openInMaps = () => {
    const url = `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}&zoom=15`;
    window.open(url, "_blank");
  };

  const copyCoordinates = () => {
    const coords = `${coordinates.lat}, ${coordinates.lng}`;
    navigator.clipboard.writeText(coords);
  };

  return (
    <div className="bg-stone-50 rounded-lg shadow-lg border border-stone-200 max-w-sm w-full z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone-200">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-stone-500" />
          <h3 className="font-semibold text-stone-900">{title}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Address */}
        <div>
          <p className="text-sm text-stone-600 font-medium">{address}</p>
          {city &&
            city.split(", ").map((part, index) => (
              <p key={index} className="text-sm text-stone-600">
                {part}
              </p>
            ))}
          <p className="text-sm text-stone-600">{country}</p>
        </div>

        {/* Food Center specific info */}
        {foodCenter && (
          <div className="space-y-2">
            {foodCenter.description && (
              <p className="text-sm text-stone-700">{foodCenter.description}</p>
            )}

            <div className="flex items-center space-x-2 text-sm text-stone-600">
              <span className="px-2 py-1 bg-stone-100 text-stone-800 rounded-full text-xs">
                {foodCenter.type.replace("_", " ")}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  foodCenter.current_availability === "available"
                    ? "bg-green-100 text-green-800"
                    : foodCenter.current_availability === "limited"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {foodCenter.current_availability}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-1">
              {foodCenter.phone && (
                <div className="flex items-center space-x-2 text-sm text-stone-600">
                  <Phone className="h-4 w-4" />
                  <span>{foodCenter.phone}</span>
                </div>
              )}
              {foodCenter.email && (
                <div className="flex items-center space-x-2 text-sm text-stone-600">
                  <Mail className="h-4 w-4" />
                  <span>{foodCenter.email}</span>
                </div>
              )}
              {foodCenter.website && (
                <div className="flex items-center space-x-2 text-sm text-stone-600">
                  <Globe className="h-4 w-4" />
                  <a
                    href={foodCenter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>

            {/* Operating Hours */}
            {foodCenter.operating_hours && (
              <div className="flex items-start space-x-2 text-sm text-stone-600">
                <Clock className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium">Operating Hours:</p>
                  {Object.entries(foodCenter.operating_hours).map(
                    ([day, hours]) => (
                      <p key={day} className="text-xs">
                        {day}: {hours.open} - {hours.close}
                      </p>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t border-stone-200">
          <button
            onClick={openInMaps}
            className="flex-1 bg-stone-500 text-white px-3 py-2 rounded-md text-sm hover:bg-stone-600 transition-colors cursor-pointer"
          >
            Open in Maps
          </button>
          <button
            onClick={copyCoordinates}
            className="px-3 py-2 border border-stone-300 rounded-md text-sm hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Copy Coords
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;
