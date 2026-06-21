import { describe, expect, it } from "vitest";
import { createDefaultSiteConfig } from "@/lib/site-config-defaults";

describe("createDefaultSiteConfig", () => {
  it("returns safe fallback when API is unavailable", () => {
    expect(createDefaultSiteConfig()).toEqual({
      maintenance_mode: false,
      maintenance_message: "",
      terms_version: 1,
      terms_content: "",
      terms_required: false,
    });
  });
});
