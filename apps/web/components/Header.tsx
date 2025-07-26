"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus } from "lucide-react";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import AddLocationModal from "@/components/AddLocationModal";
import { useRouter } from "next/navigation";
import {
  SUPPORTED_LOCALES,
  handleLocaleChange,
} from "@crowdsourced-meal-map/shared";

const cmm = "/cmm.png";

const Header = () => {
  const t = useTranslations("header");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const locale = useLocale();

  const handleLocaleChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const path = window.location.pathname;
    const newPath = handleLocaleChange(newLocale, path, SUPPORTED_LOCALES);
    router.push(newPath);
  };

  return (
    <>
      <header className="bg-stone-200 border-[1px] border-dashed border-stone-600 rounded-lg px-4 py-3 m-2 mt-5 w-[90%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src={cmm}
              alt="CrowdSourced Meal Map"
              className="h-9 w-9"
              width={36}
              height={36}
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {t("title")}
              </h1>
              <p className="text-xs text-gray-500">{t("subtitle")}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/${locale}/add-location`)}
              className="h-9 flex justify-center items-center cursor-pointer bg-stone-50 border-[1px] border-dashed border-stone-700 rounded-lg p-2 hover:bg-stone-100 disabled:cursor-not-allowed"
              disabled
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("addLocation")}
            </button>
            <AuthButton />
            <select
              value={locale}
              onChange={handleLocaleChangeEvent}
              className="h-9 px-2 border border-dashed border-stone-950 rounded-lg bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400"
              aria-label="Select language"
            >
              {SUPPORTED_LOCALES.map((l) => (
                <option key={l.code} value={l.code} disabled={!l.enabled}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};

export default Header;
