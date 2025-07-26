"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  FOOD_CENTER_TYPES,
  DIETARY_RESTRICTIONS,
  AVAILABILITY_STATUSES,
  getFoodCenterTypeColorClasses,
  getDietaryRestrictionColorClasses,
  cn,
} from "@crowdsourced-meal-map/shared";

interface ColorCardProps {
  className?: string;
  compact?: boolean;
}

const ColorCard: React.FC<ColorCardProps> = ({
  className,
  compact = false,
}) => {
  const t = useTranslations("ColorCard");

  if (compact) {
    return (
      <div
        className={cn("bg-white rounded-lg shadow-sm border p-3", className)}
      >
        <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          {t("quickReference")}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Food Center Types */}
          <div>
            <span className="text-gray-600 font-medium">{t("centers")}:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {FOOD_CENTER_TYPES.slice(0, 3).map((type) => {
                const { bg } = getFoodCenterTypeColorClasses(type.value);
                return (
                  <div
                    key={type.value}
                    className={cn("w-3 h-3 rounded-full", bg)}
                    title={type.label}
                  />
                );
              })}
            </div>
          </div>

          {/* Dietary Options */}
          <div>
            <span className="text-gray-600 font-medium">{t("dietary")}:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {DIETARY_RESTRICTIONS.slice(0, 4).map((restriction) => {
                const { bg } = getDietaryRestrictionColorClasses(
                  restriction.value,
                );
                return (
                  <div
                    key={restriction.value}
                    className={cn("w-2 h-2 rounded-full", bg)}
                    title={restriction.label}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-lg border", className)}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("colorGuide")}
        </h3>

        {/* Food Center Types */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {t("foodCenterTypes")}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FOOD_CENTER_TYPES.map((type) => {
              const { bg, text } = getFoodCenterTypeColorClasses(type.value);
              return (
                <div key={type.value} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 border-white shadow-sm",
                        bg,
                      )}
                    />
                    <span
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-full",
                        bg,
                        text,
                      )}
                    >
                      {type.label.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 flex-1">
                    {type.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {t("dietaryOptions")}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DIETARY_RESTRICTIONS.map((restriction) => {
              const { bg, text } = getDietaryRestrictionColorClasses(
                restriction.value,
              );
              return (
                <div
                  key={restriction.value}
                  className="flex items-center space-x-3"
                >
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-4 h-4 rounded-full", bg)} />
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        bg,
                        text,
                      )}
                    >
                      {restriction.label.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 flex-1">
                    {restriction.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Availability Status */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {t("availabilityStatus")}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY_STATUSES.map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    status.color === "green" && "bg-green-500",
                    status.color === "yellow" && "bg-yellow-500",
                    status.color === "red" && "bg-red-500",
                    status.color === "gray" && "bg-gray-500",
                  )}
                />
                <span className="text-xs text-gray-700">{status.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Tips */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            {t("usageTips")}
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• {t("tip1")}</li>
            <li>• {t("tip2")}</li>
            <li>• {t("tip3")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorCard;
