import { describe, expect, it } from "vitest";
import {
  buildMetaDescription,
  buildProductDescription,
  SITE_KEYWORDS,
  siteKeywords,
} from "@/lib/seo";

describe("seo helpers", () => {
  it("combines catch copy and description for product metadata", () => {
    expect(
      buildProductDescription({
        title: "Miru",
        catch_copy: "やさしい健康習慣",
        description: "睡眠と気分を記録するアプリ",
      }),
    ).toBe("やさしい健康習慣 睡眠と気分を記録するアプリ");
  });

  it("truncates long descriptions", () => {
    const long = "あ".repeat(200);
    expect(buildMetaDescription(long).length).toBeLessThanOrEqual(160);
  });

  it("includes site-wide SEO keywords", () => {
    expect(SITE_KEYWORDS).toContain("個人開発アプリ おすすめ");
    expect(SITE_KEYWORDS).toContain("Product Hunt 日本語版");
    expect(siteKeywords("React")).toEqual([...SITE_KEYWORDS, "React"]);
  });
});
