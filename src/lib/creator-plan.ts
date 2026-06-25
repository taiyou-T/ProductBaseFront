import type { CreatorProfile } from "@/types";

export const CREATOR_PLAN_LABELS: Record<CreatorProfile["plan_type"], string> = {
  free: "無料掲載",
  premium: "Premium 掲載",
};

export const FREE_LISTING_SUBMISSION_LIMIT = 3;
export const PREMIUM_LISTING_SUBMISSION_LIMIT = 5;

export function listingSubmissionLimit(planType: CreatorProfile["plan_type"]): number {
  return planType === "premium"
    ? PREMIUM_LISTING_SUBMISSION_LIMIT
    : FREE_LISTING_SUBMISSION_LIMIT;
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
