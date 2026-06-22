const JST = "Asia/Tokyo";

export function formatJapanDatetime(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleString("ja-JP", { timeZone: JST });
}
