export const AUTH_COOKIE_NAME = "productbase_auth";

export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/settings",
  "/favorites",
  "/creator-favorites",
  "/conversations",
  "/notifications",
  "/view-history",
  "/billing/success",
  "/billing/cancel",
] as const;

const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  if (!isProtectedPath(next) && next !== "/dashboard") {
    return "/dashboard";
  }
  return next;
}

export function loginUrlWithNext(pathname: string): string {
  if (!isProtectedPath(pathname)) {
    return "/login";
  }
  const params = new URLSearchParams({ next: pathname });
  return `/login?${params.toString()}`;
}

export function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AUTH_COOKIE_NAME}=1; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
