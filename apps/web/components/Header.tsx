"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Plus } from "lucide-react";
import { AuthButton } from "./AuthButton";
import { AddLocationModal } from "./AddLocationModal";

export function Header() {
  const t = useTranslations("Header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {t("title")}
              </h1>
              <p className="text-xs text-gray-500">{t("subtitle")}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("addLocation")}
            </button>
            <AuthButton />
          </div>
        </div>
      </header>

      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
