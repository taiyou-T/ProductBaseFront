export const INQUIRY_CATEGORIES = [
  { value: "account", label: "アカウントについて" },
  { value: "listing", label: "掲載/閲覧について" },
  { value: "feedback", label: "ご要望/不具合" },
  { value: "other", label: "その他のお問い合わせ" },
] as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number]["value"];
