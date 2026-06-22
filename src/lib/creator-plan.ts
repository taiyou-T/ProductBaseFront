import type { CreatorProfile } from "@/types";
import { formatJapanDate, parseApiDatetime } from "@/lib/datetime";

export const CREATOR_PLAN_LABELS: Record<CreatorProfile["plan_type"], string> = {
  free_trial: "無料トライアル",
  standard: "基本掲載",
  premium: "Premium 掲載",
};

export function formatTrialEndDate(iso: string): string {
  return formatJapanDate(iso);
}

export function trialDaysRemaining(iso: string): number {
  const end = parseApiDatetime(iso);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}
