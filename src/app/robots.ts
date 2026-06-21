import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/api";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/login",
        "/register",
        "/auth/",
        "/favorites",
        "/creator-favorites",
        "/notifications",
        "/conversations",
        "/view-history",
        "/settings/",
        "/billing/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
