"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import Image from "next/image";
import { AuthButton } from "@/components/AuthButton";
import AddLocationModal from "@/components/AddLocationModal";

const cmm = "/cmm.png";

export function Header() {
  const t = useTranslations("Header");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
              onClick={() => setIsAddModalOpen(true)}
              className="h-9 flex justify-center items-center cursor-pointer bg-stone-50 border-[1px] border-dashed border-stone-700 rounded-lg p-2 hover:bg-stone-100"
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
