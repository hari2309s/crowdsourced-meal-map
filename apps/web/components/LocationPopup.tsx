"use client";

import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  CopyIcon,
  MapIcon,
} from "lucide-react";
import type { FoodCenter } from "@crowdsourced-meal-map/shared";
import {
  getFoodCenterTypeColorClasses,
  openLocationInMaps,
  copyCoordinatesToClipboard,
  getAvailabilityBgColor,
} from "@crowdsourced-meal-map/shared";

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
  const typeColors = foodCenter
    ? getFoodCenterTypeColorClasses(foodCenter.type)
    : { bg: "bg-stone-200", text: "text-stone-800" };

  const openInMaps = () => {
    openLocationInMaps(coordinates.lat, coordinates.lng);
  };

  const copyCoordinates = () => {
    copyCoordinatesToClipboard(coordinates.lat, coordinates.lng);
  };

  return (
    <div
      className={`${getAvailabilityBgColor(foodCenter?.current_availability)} rounded-lg shadow-lg border border-stone-200 max-w-sm w-full z-50`}
    >
      <div className="flex items-center justify-between p-3 border-b border-stone-200">
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

      <div className="p-4 space-y-3">
        <div>
          <p className="text-sm text-stone-600 font-medium">
            {address}
            {foodCenter?.postal_code && `, ${foodCenter.postal_code}`}
            {city && `, ${city}`}
            {country && `, ${country}`}
          </p>
        </div>

        {foodCenter && (
          <div className="space-y-2">
            {foodCenter.description && (
              <p className="text-sm text-stone-700">{foodCenter.description}</p>
            )}

            <div className="flex items-center space-x-2 text-sm text-stone-600">
              <span
                className={`px-2 py-1 rounded-lg text-xs ${typeColors.bg} ${typeColors.text}`}
              >
                {foodCenter.type.replace("_", " ")}
              </span>
              <span
                className={`px-2 py-1 rounded-lg text-xs ${
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

            <div className="space-y-1">
              {foodCenter.phone && (
                <div className="flex items-center space-x-2 text-sm text-stone-600">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${foodCenter.phone.replace(/\s+/g, "")}`}
                    className="text-stone-600 hover:text-stone-800 hover:underline transition-colors cursor-pointer"
                    title="Call this number"
                  >
                    {foodCenter.phone}
                  </a>
                </div>
              )}
              {foodCenter.email && (
                <div className="flex items-center space-x-2 text-sm text-stone-600">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${foodCenter.email}?subject=Inquiry about ${encodeURIComponent(title)}&body=Hello,%0D%0A%0D%0AI would like to get more information about your services.%0D%0A%0D%0ALocation: ${encodeURIComponent(address)}, ${encodeURIComponent(city)}, ${encodeURIComponent(country)}%0D%0A%0D%0AThank you.`}
                    className="text-stone-600 hover:text-stone-800 hover:underline transition-colors cursor-pointer"
                    title="Send email"
                  >
                    {foodCenter.email}
                  </a>
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

        <div className="flex space-x-2 pt-2 border-t border-stone-200">
          <button
            onClick={openInMaps}
            className="flex items-center gap-2 flex-1 bg-stone-500 text-white px-3 py-2 rounded-md text-sm hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <MapIcon className="h-4 w-4" />
            Open in Maps
          </button>
          <button
            onClick={copyCoordinates}
            className="flex items-center gap-2 px-3 py-2 border border-dashed border-stone-400 rounded-md text-sm bg-stone-50 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <CopyIcon className="h-4 w-4" />
            Copy Coords
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;
