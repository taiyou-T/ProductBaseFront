import type { SubscriptionPlanType } from "@/types";
import { LEGACY_SUBSCRIPTION_PLAN_LABELS, SUBSCRIPTION_PLANS } from "@/lib/billing-plans";

export const SITE_NAME = "ProductBase";

export const IMAGE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;
export const IMAGE_UPLOAD_MAX_LABEL = "2MB";

export const DEVELOPMENT_STATUS_LABELS: Record<string, string> = {
  planning: "企画中",
  developing: "開発中",
  testing: "テスト中",
  beta: "ベータ",
  released: "リリース済み",
  ended: "終了",
};

export const APPROVAL_STATUS_LABELS: Record<string, string> = {
  draft: "下書き",
  pending: "審査中",
  approved: "承認済み",
  rejected: "却下",
  archived: "アーカイブ",
};

export const SORT_OPTIONS = [
  { value: "newest", label: "新着" },
  { value: "popular", label: "人気" },
  { value: "favorites", label: "お気に入り数" },
] as const;

export const REPORT_REASONS = [
  { value: "spam", label: "スパム" },
  { value: "copyright", label: "著作権侵害" },
  { value: "fake", label: "虚偽・なりすまし" },
  { value: "inappropriate", label: "不適切な内容" },
  { value: "other", label: "その他" },
] as const;

export { SUBSCRIPTION_PLANS } from "@/lib/billing-plans";

export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  active: "加入中",
  trialing: "トライアル中",
  past_due: "支払い遅延",
  canceled: "解約済み",
  incomplete: "手続き未完了",
};

export function planLabel(planType: SubscriptionPlanType | string): string {
  return (
    SUBSCRIPTION_PLANS.find((p) => p.type === planType)?.name
    ?? LEGACY_SUBSCRIPTION_PLAN_LABELS[planType]
    ?? planType
  );
}
