import type { CreatorProfile } from "@/types";
import { formatJapanDate, parseApiDatetime } from "@/lib/datetime";

export const CREATOR_PLAN_LABELS: Record<CreatorProfile["plan_type"], string> = {
  free_trial: "無料トライアル",
  standard: "基本掲載",
  premium: "Premium 掲載",
};

export const STANDARD_LISTING_SUBMISSION_LIMIT = 3;
export const PREMIUM_LISTING_SUBMISSION_LIMIT = 10;

export function listingSubmissionLimit(planType: CreatorProfile["plan_type"]): number {
  return planType === "premium"
    ? PREMIUM_LISTING_SUBMISSION_LIMIT
    : STANDARD_LISTING_SUBMISSION_LIMIT;
}

export function canSubmitListing(
  profile: CreatorProfile | null | undefined,
  approvalStatus: "draft" | "rejected" | "pending" | "approved" | "archived" | undefined,
): boolean {
  if (!profile || profile.can_list === false) return false;
  if (approvalStatus === "rejected") return true;
  if (approvalStatus !== "draft" && approvalStatus !== "archived") return false;

  const limit = profile.listing_submission_limit ?? listingSubmissionLimit(profile.plan_type);
  const count = profile.listing_submission_count ?? 0;

  return count < limit;
}

export function formatListingSubmissionUsage(profile: CreatorProfile): string {
  const limit = profile.listing_submission_limit ?? listingSubmissionLimit(profile.plan_type);
  const count = profile.listing_submission_count ?? 0;
  return `${count} / ${limit} 件`;
}

export function formatTrialEndDate(iso: string): string {
  return formatJapanDate(iso);
}

export function trialDaysRemaining(iso: string): number {
  const end = parseApiDatetime(iso);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}
