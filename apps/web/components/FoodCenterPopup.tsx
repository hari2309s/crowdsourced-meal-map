"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, Phone, Globe, Star, AlertCircle, X } from "lucide-react";
import {
  cn,
  formatOperatingHours,
  getStatusColor,
  DIETARY_RESTRICTIONS,
  type FoodCenter,
  type Review,
  type AvailabilityStatus,
} from "@crowdsourced-meal-map/shared";
import { useSupabase } from "../app/providers";
import {
  createReview,
  createAvailabilityUpdate,
  type CreateAvailabilityUpdateInput,
} from "@crowdsourced-meal-map/database";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface FoodCenterPopupProps {
  center: FoodCenter;
  onClose: () => void;
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

const availabilitySchema = z.object({
  status: z.enum(["available", "limited", "unavailable", "unknown"]),
  notes: z.string().optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;
type AvailabilityForm = z.infer<typeof availabilitySchema>;

export function FoodCenterPopup({ center, onClose }: FoodCenterPopupProps) {
  const t = useTranslations("FoodCenterPopup");
  const { supabase } = useSupabase();
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSubmittingAvailability, setIsSubmittingAvailability] =
    useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);

  const reviewForm = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const availabilityForm = useForm<AvailabilityForm>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      status: "unknown",
      notes: "",
    },
  });

  const onSubmitReview = async (data: {
    rating: number;
    comment?: string | undefined;
  }) => {
    if (!data.comment) return;

    setIsSubmittingReview(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) return;

      const reviewData: Omit<
        Review,
        "id" | "created_at" | "updated_at" | "helpful_count"
      > = {
        food_center_id: center.id,
        user_id: sessionData.session.user.id,
        rating: data.rating,
        comment: data.comment,
      };

      await createReview(reviewData);
      reviewForm.reset();
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const onSubmitAvailability = async (data: {
    status: AvailabilityStatus;
    notes?: string | undefined;
  }) => {
    setIsSubmittingAvailability(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) return;

      const updateData: CreateAvailabilityUpdateInput = {
        food_center_id: center.id,
        status: data.status,
        notes: data.notes ?? "",
        reported_by: sessionData.session.user.id,
      };

      await createAvailabilityUpdate(updateData);
      availabilityForm.reset();
      setShowAvailabilityForm(false);
    } catch (error) {
      console.error("Error submitting availability update:", error);
    } finally {
      setIsSubmittingAvailability(false);
    }
  };

  return (
    <div className="p-4 w-64">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-semibold text-gray-900">{center.name}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 space-y-2 text-xs text-gray-600">
        <p>
          {center.address}, {center.city}
        </p>
        <div className="flex items-center space-x-2">
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              getStatusColor(center.current_availability),
            )}
          >
            {center.current_availability}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>{formatOperatingHours(center.operating_hours)}</span>
        </div>
        {center.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>{center.phone}</span>
          </div>
        )}
        {center.website && (
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <a
              href={center.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600"
            >
              Website
            </a>
          </div>
        )}
        {center.dietary_restrictions &&
          center.dietary_restrictions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {center.dietary_restrictions.map((restriction) => (
                <span
                  key={restriction}
                  className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                >
                  {
                    DIETARY_RESTRICTIONS.find((r) => r.value === restriction)
                      ?.label
                  }
                </span>
              ))}
            </div>
          )}
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="btn btn-secondary btn-sm w-full flex items-center justify-center"
        >
          <Star className="h-4 w-4 mr-1" />
          {t("submitReview")}
        </button>
        <button
          onClick={() => setShowAvailabilityForm(!showAvailabilityForm)}
          className="btn btn-secondary btn-sm w-full flex items-center justify-center"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          {t("reportAvailability")}
        </button>
      </div>

      {showReviewForm && (
        <form
          onSubmit={reviewForm.handleSubmit(onSubmitReview)}
          className="mt-4 space-y-2"
        >
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t("rating")}
            </label>
            <input
              type="number"
              min="1"
              max="5"
              {...reviewForm.register("rating", { valueAsNumber: true })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t("comment")}
            </label>
            <textarea
              {...reviewForm.register("comment")}
              className="input"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmittingReview}
            className="btn btn-primary btn-sm w-full"
          >
            {isSubmittingReview ? "Submitting..." : t("submit")}
          </button>
        </form>
      )}

      {showAvailabilityForm && (
        <form
          onSubmit={availabilityForm.handleSubmit(onSubmitAvailability)}
          className="mt-4 space-y-2"
        >
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t("availabilityStatus")}
            </label>
            <select {...availabilityForm.register("status")} className="input">
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              {t("notes")}
            </label>
            <textarea
              {...availabilityForm.register("notes")}
              className="input"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmittingAvailability}
            className="btn btn-primary btn-sm w-full"
          >
            {isSubmittingAvailability ? "Submitting..." : t("submit")}
          </button>
        </form>
      )}
    </div>
  );
}
