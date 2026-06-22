const JST = "Asia/Tokyo";

export function parseApiDatetime(value: string): Date {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");

  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(normalized)) {
    return new Date(normalized);
  }

  return new Date(`${normalized}+09:00`);
}

export function formatJapanDatetime(value: string | null | undefined): string {
  if (!value) return "";
  return parseApiDatetime(value).toLocaleString("ja-JP", { timeZone: JST });
}

export function formatJapanDate(value: string | null | undefined): string {
  if (!value) return "";
  return parseApiDatetime(value).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: JST,
  });
}
