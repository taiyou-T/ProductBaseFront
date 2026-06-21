import type { MetadataRoute } from "next";
import { getSiteUrl, serverApi } from "@/lib/api";
import type { Category, PaginatedResponse, Product, Tag } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/products`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const [products, categories, tags] = await Promise.all([
    fetchAllProducts(),
    serverApi<{ data: Category[] }>("/public/categories").catch(() => ({ data: [] as Category[] })),
    serverApi<{ data: Tag[] }>("/public/tags").catch(() => ({ data: [] as Tag[] })),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const developerSlugs = new Set(
    products
      .map((p) => p.user?.creator_profile?.slug)
      .filter((slug): slug is string => Boolean(slug)),
  );

  const developerRoutes: MetadataRoute.Sitemap = [...developerSlugs].map((slug) => ({
    url: `${siteUrl}/developers/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.data.map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.data.map((t) => ({
    url: `${siteUrl}/tags/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...developerRoutes, ...categoryRoutes, ...tagRoutes];
}

async function fetchAllProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let page = 1;
  let lastPage = 1;

  while (page <= lastPage) {
    const res = await serverApi<PaginatedResponse<Product>>(
      `/public/products?per_page=100&page=${page}`,
    ).catch(() => null);
    if (!res) break;
    all.push(...res.data);
    lastPage = res.meta.last_page;
    page += 1;
  }

  return all;
}
