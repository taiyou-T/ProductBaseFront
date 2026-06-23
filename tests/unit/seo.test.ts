import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildMetaDescription,
  buildProductDescription,
  buildProductKeywords,
  resolveOgImage,
  SITE_KEYWORDS,
  siteKeywords,
} from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildProductJsonLd, buildWebSiteJsonLd } from "@/lib/seo-jsonld";

describe("seo helpers", () => {
  it("combines catch copy and description for product metadata", () => {
    expect(
      buildProductDescription({
        title: "Miru",
        catch_copy: "やさしい健康習慣",
        description: "睡眠と気分を記録するアプリ",
        category: { name: "モバイルアプリ" },
      }),
    ).toBe("やさしい健康習慣 睡眠と気分を記録するアプリ モバイルアプリの個人開発アプリ");
  });

  it("truncates long descriptions", () => {
    const long = "あ".repeat(200);
    expect(buildMetaDescription(long).length).toBeLessThanOrEqual(160);
  });

  it("includes site-wide SEO keywords", () => {
    expect(SITE_KEYWORDS).toContain("個人開発アプリ おすすめ");
    expect(siteKeywords("React")).toContain("React");
  });

  it("builds page-specific product keywords without site-wide noise", () => {
    expect(
      buildProductKeywords({
        title: "Miru",
        category: { name: "モバイルアプリ" },
        tags: [{ name: "React" }],
      }),
    ).toEqual(["Miru", "モバイルアプリ", "個人開発アプリ", "React"]);
  });

  it("resolves absolute OG image URLs", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://productbase-jp.com";
    expect(resolveOgImage()).toBe("https://productbase-jp.com/favicon.ico");
    expect(resolveOgImage("https://cdn.example.com/a.png")).toBe("https://cdn.example.com/a.png");
  });

  it("builds absolute canonical URLs", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://productbase-jp.com";
    expect(absoluteUrl("/products")).toBe("https://productbase-jp.com/products");
  });
});

describe("seo json-ld", () => {
  it("builds website search action", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://productbase-jp.com";
    const jsonLd = buildWebSiteJsonLd();
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.potentialAction).toMatchObject({
      "@type": "SearchAction",
    });
  });

  it("builds product json-ld with canonical page URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://productbase-jp.com";
    const jsonLd = buildProductJsonLd({
      id: 6,
      title: "Miru",
      slug: "miru",
      catch_copy: "健康習慣",
      description: "記録アプリ",
      service_url: "https://example.com",
      thumbnail_url: "https://cdn.example.com/miru.png",
      development_status: "developing",
      is_public: true,
      published_at: "2026-06-22T21:07:37+09:00",
      updated_at: "2026-06-23T21:05:14+09:00",
      view_count: 1,
      favorite_count: 0,
      is_published: true,
      category: { id: 2, name: "モバイルアプリ", slug: "mobile-app", sort_order: 2 },
      tags: [],
      user: {
        id: 6,
        name: "開発者",
        email: "dev@example.com",
        email_verified_at: null,
        avatar_url: null,
        is_admin: false,
        is_creator: true,
        is_supporter: false,
        terms_agreed_version: 1,
        current_terms_version: 1,
        needs_terms_agreement: false,
        creator_profile: {
          id: 5,
          user_id: 6,
          display_name: "FURUKAWA",
          slug: "furukawa",
          bio: null,
          location: null,
          website_url: null,
          github_url: null,
          x_url: null,
          cover_url: null,
          chat_status: "open",
          plan_type: "free_trial",
          trial_ends_at: null,
          can_list: true,
          listing_submission_limit: 3,
          listing_submission_count: 1,
        },
      },
      images: [],
      created_at: "2026-06-24T21:05:10+09:00",
    });

    expect(jsonLd.url).toBe("https://productbase-jp.com/products/6-miru");
    expect(jsonLd.downloadUrl).toBe("https://example.com");
  });

  it("builds breadcrumb list", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://productbase-jp.com";
    const jsonLd = buildBreadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: "成果物", path: "/products" },
    ]);

    expect(jsonLd.itemListElement).toHaveLength(2);
  });
});
