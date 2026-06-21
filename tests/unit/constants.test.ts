import { describe, expect, it } from "vitest";
import { SITE_NAME, DEVELOPMENT_STATUS_LABELS, REPORT_REASONS } from "@/lib/constants";

describe("constants", () => {
  it("defines site name", () => {
    expect(SITE_NAME).toBe("ProductBase");
  });

  it("maps development statuses to Japanese labels", () => {
    expect(DEVELOPMENT_STATUS_LABELS.released).toBe("リリース済み");
    expect(DEVELOPMENT_STATUS_LABELS.beta).toBe("ベータ");
  });

  it("defines report reasons", () => {
    expect(REPORT_REASONS.map((r) => r.value)).toContain("spam");
    expect(REPORT_REASONS.length).toBeGreaterThan(0);
  });
});
