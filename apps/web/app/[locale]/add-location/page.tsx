"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { createFoodCenter } from "@crowdsourced-meal-map/database";
import { useSupabase } from "@/providers";
import {
  FOOD_CENTER_TYPES,
  DIETARY_RESTRICTIONS,
  locationSchema,
  DEFAULT_LOCATION_FORM,
  type LocationForm,
} from "@crowdsourced-meal-map/shared";

export default function AddLocationPage() {
  const t = useTranslations("addLocationModal");
  const { supabase } = useSupabase();
  const router = useRouter();
  const locale = useLocale();
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

      await createFoodCenter({
        ...data,
        location: { lat: data.lat, lng: data.lng },
        created_by: userId,
        verified: false,
        current_availability: "unknown",
      } as any);
      reset();
      router.push(`/${locale}/`);
    } catch (error) {
      console.error("Error submitting location:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br py-12 px-4">
      <AnimatePresence>
        <motion.div
          className="w-full max-w-4xl bg-stone-200 border-[1px] border-dashed border-stone-600 rounded-lg p-6 sm:p-8 m-2 mt-5"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h2
            className="text-3xl font-semibold text-stone-900 text-center mb-6"
            variants={inputVariants}
          >
            {t("title")}
          </motion.h2>
          <form
            onSubmit={handleSubmit(onSubmit as any)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            aria-label="Add Food Center Location"
          >
            <motion.div variants={inputVariants} className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                {t("name")}
              </label>
              <input
                id="name"
                {...register("name")}
                className="w-full px-4 py-2 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg focus:border-stone-950 focus:ring-2 focus:ring-stone-950 text-stone-900 placeholder-stone-400 transition duration-200"
                placeholder="Enter food bank name"
                aria-required="true"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={inputVariants} className="sm:col-span-3">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                {t("address")}
              </label>
              <input
                id="address"
                {...register("address")}
                className="w-full px-4 py-2 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg focus:border-stone-950 focus:ring-2 focus:ring-stone-950 text-stone-900 placeholder-stone-400 transition duration-200"
                placeholder="Enter address"
                aria-required="true"
                aria-invalid={errors.address ? "true" : "false"}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.address.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={inputVariants}>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                {t("type")}
              </label>
              <select
                id="type"
                {...register("type")}
                className="w-full px-4 py-2 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg focus:border-stone-950 focus:ring-2 focus:ring-stone-950 text-stone-900"
                aria-required="true"
              >
                {FOOD_CENTER_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={inputVariants}>
              <label
                htmlFor="dietaryRestrictions"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                {t("dietaryRestrictions")}
              </label>
              <div className="flex flex-wrap gap-3">
                {DIETARY_RESTRICTIONS.map((restriction) => (
                  <label
                    key={restriction.value}
                    className="flex items-center space-x-2 text-sm text-stone-700"
                  >
                    <input
                      type="checkbox"
                      {...register("dietary_restrictions")}
                      value={restriction.value}
                      className="h-4 w-4 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded focus:border-stone-950 focus:ring-2 focus:ring-stone-950"
                    />
                    <span>{restriction.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            <motion.div variants={inputVariants}>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                {t("phone")}
              </label>
              <input
                id="phone"
                {...register("phone")}
                className="w-full px-4 py-2 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg focus:border-stone-950 focus:ring-2 focus:ring-stone-950 text-stone-900 placeholder-stone-400 transition duration-200"
                placeholder="Enter phone number"
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={inputVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                {t("email")}
              </label>
              <input
                id="email"
                {...register("email")}
                className="w-full px-4 py-2 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg focus:border-stone-950 focus:ring-2 focus:ring-stone-950 text-stone-900 placeholder-stone-400 transition duration-200"
                placeholder="Enter email"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={inputVariants}>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                {t("website")}
              </label>
              <input
                id="website"
                {...register("website")}
                className="w-full px-4 py-2 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg focus:border-stone-950 focus:ring-2 focus:ring-stone-950 text-stone-900 placeholder-stone-400 transition duration-200"
                placeholder="Enter website URL"
                aria-invalid={errors.website ? "true" : "false"}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.website.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={inputVariants} className="sm:col-span-3">
              <label
                htmlFor="operatingHours"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                {t("operatingHours")}
              </label>
              <div className="grid grid-cols-7 gap-4">
                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                  (day) => (
                    <motion.div
                      key={day}
                      className="flex flex-col items-center space-y-2"
                      variants={inputVariants}
                    >
                      <span className="text-sm text-stone-700 capitalize">
                        {day}
                      </span>
                      <input
                        type="time"
                        {...(register as any)(`operating_hours.${day}.open`)}
                        className="w-full px-2 py-1 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg focus:border-stone-950 focus:ring-2 focus:ring-stone-950 text-stone-900"
                      />
                      <input
                        type="time"
                        {...(register as any)(`operating_hours.${day}.close`)}
                        className="w-full px-2 py-1 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg focus:border-stone-950 focus:ring-2 focus:ring-stone-950 text-stone-900"
                      />
                    </motion.div>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex space-x-6 mt-6 sm:col-span-3"
              variants={inputVariants}
            >
              <button
                type="button"
                onClick={() => router.push(`/${locale}/`)}
                className="w-full py-2 px-3 bg-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-950 transition duration-200"
                aria-label="Cancel"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-3 bg-stone-700 text-stone-50 border-[1px] border-dashed border-stone-600 rounded-lg hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-950 transition duration-200 disabled:opacity-50"
                aria-label="Submit"
              >
                {isSubmitting ? "Submitting..." : t("submit")}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
