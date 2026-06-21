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
