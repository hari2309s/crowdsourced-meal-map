"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  cn,
  formatOperatingHours,
  getStatusColor,
  FOOD_CENTER_TYPES,
  DIETARY_RESTRICTIONS,
} from "@crowdsourced-meal-map/shared";
import type { FoodCenter } from "@crowdsourced-meal-map/shared";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  foodCenters: FoodCenter[];
  selectedCenter: FoodCenter | null;
  onSelectCenter: (center: FoodCenter | null) => void;
  filters: {
    type: string;
    dietary_restrictions: string[];
    city: string;
  };
  onFiltersChange: (filters: {
    type: string;
    dietary_restrictions: string[];
    city: string;
  }) => void;
  loading: boolean;
}

const filterSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  dietary_restrictions: z.array(z.string()).optional(),
});

type FilterForm = z.infer<typeof filterSchema>;

const Sidebar = ({
  foodCenters,
  selectedCenter,
  onSelectCenter,
  filters,
  onFiltersChange,
  loading,
}: SidebarProps) => {
  const t = useTranslations("Sidebar");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { register, handleSubmit, watch } = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      type: filters.type,
      dietary_restrictions: filters.dietary_restrictions,
    },
  });

  const searchValue = watch("search");

  const filteredCenters = foodCenters.filter((center) =>
    center.name.toLowerCase().includes(searchValue?.toLowerCase() || ""),
  );

  const onSubmit = (data: FilterForm) => {
    onFiltersChange({
      ...filters,
      type: data.type || "",
      dietary_restrictions: data.dietary_restrictions || [],
    });
  };

  return (
    <div className="w-full md:w-96 h-[600px] bg-white border-[1px] border-dashed border-stone-700 rounded-lg flex flex-col">
      <div className="p-4 border-dashed border-b border-stone-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative bg-stone-100 border-[1px] border-dashed border-stone-600 rounded-lg h-9 focus:border-stone-600 focus:ring-stone-600 focus:outline-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              {...register("search")}
              type="text"
              placeholder={t("searchPlaceholder")}
              className="pl-10 w-full h-full"
            />
          </div>

          <button
            type="button"
            disabled
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="btn btn-secondary btn-sm w-full flex items-center justify-between disabled:cursor-not-allowed"
          >
            <span className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {t("filters")}
            </span>
            {isFilterOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    {t("type")}
                  </label>
                  <select {...register("type")} className="input" id="type">
                    <option value="">{t("allTypes")}</option>
                    {FOOD_CENTER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dietary_restrictions"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    {t("dietaryRestrictions")}
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto h-full">
                    {DIETARY_RESTRICTIONS.map((restriction) => (
                      <label
                        htmlFor="dietary_restrictions"
                        key={restriction.value}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id="dietary_restrictions"
                          {...register("dietary_restrictions")}
                          value={restriction.value}
                          className="h-4 w-4 text-stone-600 focus:ring-stone-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-stone-600">
                          {restriction.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-sm w-full">
                  {t("applyFilters")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-stone-500">{t("loading")}</div>
        ) : filteredCenters.length === 0 ? (
          <div className="p-4 text-center text-stone-500">{t("noResults")}</div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                onClick={() => onSelectCenter(center)}
                className={cn(
                  "p-4 cursor-pointer hover:bg-stone-50",
                  selectedCenter?.id === center.id && "bg-stone-100",
                )}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-stone-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-stone-900">
                        {center.name}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          getStatusColor(center.current_availability),
                        )}
                      >
                        {center.current_availability}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-stone-500">
                        {center.address}, {center.city}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-stone-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatOperatingHours(center.operating_hours)}
                        </span>
                      </div>
                      {center.phone && (
                        <div className="flex items-center space-x-2 text-xs text-stone-500">
                          <Phone className="h-4 w-4" />
                          <span>{center.phone}</span>
                        </div>
                      )}
                      {center.website && (
                        <div className="flex items-center space-x-2 text-xs text-stone-500">
                          <Globe className="h-4 w-4" />
                          <a
                            href={center.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-stone-600"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
