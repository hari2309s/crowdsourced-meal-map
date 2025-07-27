"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createFoodCenter } from "@crowdsourced-meal-map/database";
import { useSupabase } from "@/providers";
import {
  FOOD_CENTER_TYPES,
  DIETARY_RESTRICTIONS,
  locationSchema,
  DEFAULT_LOCATION_FORM,
  type LocationForm,
  type DietaryRestriction,
  AVAILABILITY_STATUS_VALUES,
} from "@crowdsourced-meal-map/shared";
import { motion, AnimatePresence } from "framer-motion";

type AddLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddLocationModal = ({ isOpen, onClose }: AddLocationModalProps) => {
  const t = useTranslations("addLocationModal");
  const { supabase } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationForm>({
    resolver: zodResolver(locationSchema) as any,
    defaultValues: DEFAULT_LOCATION_FORM,
  });

  const onSubmit = async (data: LocationForm) => {
    setIsSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      // Ensure lat and lng are numbers, defaulting to 0 if undefined
      const lat = data.lat ?? 0;
      const lng = data.lng ?? 0;

      await createFoodCenter({
        ...data,
        location: { lat, lng },
        created_by: userId,
        verified: false,
        current_availability: AVAILABILITY_STATUS_VALUES.UNKNOWN,
        description: data.description ?? "",
        postal_code: data.postal_code ?? "",
        district: data.district ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        website: data.website ?? "",
        contact_person: "",
        languages_spoken: data.languages ?? [],
        capacity: data.capacity ?? 0,
        dietary_restrictions: (data.dietary_restrictions ??
          []) as DietaryRestriction[],
        operating_hours: data.operating_hours ?? {},
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting location:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-stone-200 rounded-lg p-6 w-full max-w-md m-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t("title")}</h2>
              <button
                onClick={onClose}
                className="text-stone-600 hover:text-stone-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-between">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("name")}
                </label>
                <input
                  id="name"
                  {...register("name")}
                  className="bg-stone-100 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("address")}
                </label>
                <input
                  id="address"
                  {...register("address")}
                  className="bg-stone-100 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none"
                />
                {errors.address && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("type")}
                </label>
                <select id="type" {...register("type")} className="input">
                  {FOOD_CENTER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="dietaryRestrictions"
                  className="block text-sm font-medium text-stone-700 row-gap-2"
                >
                  {t("dietaryRestrictions")}
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto flex flex-wrap gap-2 items-center">
                  {DIETARY_RESTRICTIONS.map((restriction) => (
                    <label
                      key={restriction.value}
                      htmlFor="dietaryRestrictions"
                      className="flex items-center space-x-2"
                    >
                      <input
                        id="dietaryRestrictions"
                        type="checkbox"
                        {...register("dietary_restrictions")}
                        value={restriction.value}
                        className="h-4 w-4 text-stone-600 focus:ring-stone-500 border-stone-300 rounded"
                      />
                      <span className="text-sm text-stone-600">
                        {restriction.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("latitude")}
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("lat", { valueAsNumber: true })}
                  className="input"
                />
                {errors.lat && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.lat.message}
                  </p>
                )}
              </div> */}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("longitude")}
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("lng", { valueAsNumber: true })}
                  className="input"
                />
                {errors.lng && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.lng.message}
                  </p>
                )}
              </div> */}

              <div className="flex justify-between">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("phone")}
                </label>
                <input
                  id="phone"
                  {...register("phone")}
                  className="bg-stone-100 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none"
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("email")}
                </label>
                <input
                  id="email"
                  {...register("email")}
                  className="bg-stone-100 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("website")}
                </label>
                <input
                  id="website"
                  {...register("website")}
                  className="bg-stone-100 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none"
                />
                {errors.website && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.website.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="operatingHours"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("operatingHours")}
                </label>
                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                  (day) => (
                    <div key={day} className="flex space-x-2">
                      <label
                        htmlFor="operatingHours"
                        className="text-sm text-stone-600 capitalize w-16"
                      >
                        {day}
                      </label>
                      <input
                        id="operatingHours"
                        type="time"
                        {...register(`operating_hours.${day}.open`)}
                        className="bg-stone-100 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none flex-1"
                      />
                      <input
                        id="operatingHours"
                        type="time"
                        {...register(`operating_hours.${day}.close`)}
                        className="bg-stone-100 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none flex-1"
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none btn-sm flex-1"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg p-2 h-7 focus:border-stone-600 focus:ring-stone-600 focus:outline-none btn-sm flex-1"
                >
                  {isSubmitting ? "Submitting..." : t("submit")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddLocationModal;
