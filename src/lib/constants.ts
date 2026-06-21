import type { SubscriptionPlanType } from "@/types";

export const SITE_NAME = "ProductBase";

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

export const SUBSCRIPTION_PLANS = [
  {
    type: "supporter" as const,
    name: "詳細閲覧・チャット",
    description: "お気に入り上限拡大・閲覧履歴・掲載者へのチャット",
    price: "¥500/月",
    requiresCreator: false,
  },
  {
    type: "standard" as const,
    name: "基本掲載",
    description: "成果物の掲載・管理（掲載者向け）",
    price: "¥500/月",
    requiresCreator: true,
  },
  {
    type: "premium" as const,
    name: "Premium 掲載",
    description: "掲載者向け上位プラン",
    price: "¥1,500/月",
    requiresCreator: true,
  },
] as const;

export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  active: "加入中",
  trialing: "トライアル中",
  past_due: "支払い遅延",
  canceled: "解約済み",
  incomplete: "手続き未完了",
};

export function planLabel(planType: SubscriptionPlanType): string {
  return SUBSCRIPTION_PLANS.find((p) => p.type === planType)?.name ?? planType;
}
