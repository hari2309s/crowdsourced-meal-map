"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createFoodCenter } from "@crowdsourced-meal-map/database";
import { useSupabase } from "@/providers";
import {
  FOOD_CENTER_TYPES,
  DIETARY_RESTRICTIONS,
} from "@crowdsourced-meal-map/shared";
import { motion, AnimatePresence } from "framer-motion";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().default("Berlin"),
  country: z.string().default("Germany"),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  type: z.enum([
    "food_bank",
    "community_kitchen",
    "soup_kitchen",
    "mobile_unit",
    "pantry",
  ]),
  dietary_restrictions: z
    .array(
      z.enum([
        "vegetarian",
        "vegan",
        "halal",
        "kosher",
        "gluten_free",
        "dairy_free",
        "nut_free",
      ]),
    )
    .optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  operating_hours: z
    .object({
      mon: z.object({ open: z.string(), close: z.string() }).optional(),
      tue: z.object({ open: z.string(), close: z.string() }).optional(),
      wed: z.object({ open: z.string(), close: z.string() }).optional(),
      thu: z.object({ open: z.string(), close: z.string() }).optional(),
      fri: z.object({ open: z.string(), close: z.string() }).optional(),
      sat: z.object({ open: z.string(), close: z.string() }).optional(),
      sun: z.object({ open: z.string(), close: z.string() }).optional(),
    })
    .optional(),
});

type LocationForm = z.infer<typeof locationSchema>;

export function AddLocationModal({ isOpen, onClose }: AddLocationModalProps) {
  const t = useTranslations("AddLocationModal");
  const { supabase } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationForm>({
    resolver: zodResolver(locationSchema) as any,
    defaultValues: {
      name: "",
      address: "",
      city: "Berlin",
      country: "Germany",
      type: "food_bank",
      lat: 52.52,
      lng: 13.405,
      dietary_restrictions: [],
      operating_hours: {},
    },
  });

  const onSubmit = async (data: LocationForm) => {
    setIsSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      await createFoodCenter({
        ...data,
        location: { lat: data.lat, lng: data.lng },
        created_by: userId,
        verified: false,
        current_availability: "unknown",
      } as any);
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
            className="bg-white rounded-lg p-6 w-full max-w-md m-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t("title")}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("name")}
                </label>
                <input {...register("name")} className="input" />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("address")}
                </label>
                <input {...register("address")} className="input" />
                {errors.address && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("type")}
                </label>
                <select {...register("type")} className="input">
                  {FOOD_CENTER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("dietaryRestrictions")}
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {DIETARY_RESTRICTIONS.map((restriction) => (
                    <label
                      key={restriction.value}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        {...register("dietary_restrictions")}
                        value={restriction.value}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">
                        {restriction.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
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
              </div>

              <div>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("phone")}
                </label>
                <input {...register("phone")} className="input" />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("email")}
                </label>
                <input {...register("email")} className="input" />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("website")}
                </label>
                <input {...register("website")} className="input" />
                {errors.website && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.website.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("operatingHours")}
                </label>
                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                  (day) => (
                    <div key={day} className="flex space-x-2">
                      <label className="text-sm text-gray-600 capitalize w-16">
                        {day}
                      </label>
                      <input
                        type="time"
                        {...(register as any)(`operating_hours.${day}.open`)}
                        className="input flex-1"
                      />
                      <input
                        type="time"
                        {...(register as any)(`operating_hours.${day}.close`)}
                        className="input flex-1"
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm flex-1"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm flex-1"
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
}
