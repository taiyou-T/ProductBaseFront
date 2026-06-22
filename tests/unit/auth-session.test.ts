import { describe, expect, it } from "vitest";
import { isProtectedPath, loginUrlWithNext, safeNextPath } from "@/lib/auth-session";

describe("auth-session", () => {
  it("detects protected paths", () => {
    expect(isProtectedPath("/dashboard/products/new")).toBe(true);
    expect(isProtectedPath("/settings/billing")).toBe(true);
    expect(isProtectedPath("/favorites")).toBe(true);
    expect(isProtectedPath("/products/foo")).toBe(false);
    expect(isProtectedPath("/login")).toBe(false);
  });

  it("builds login url with next parameter", () => {
    expect(loginUrlWithNext("/dashboard/products")).toBe(
      "/login?next=%2Fdashboard%2Fproducts",
    );
    expect(loginUrlWithNext("/products/foo")).toBe("/login");
  });

  it("sanitizes next redirect targets", () => {
    expect(safeNextPath("/dashboard/products")).toBe("/dashboard/products");
    expect(safeNextPath("//evil.example")).toBe("/dashboard");
    expect(safeNextPath("/login")).toBe("/dashboard");
    expect(safeNextPath(null)).toBe("/dashboard");
  });
});
