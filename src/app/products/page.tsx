import Link from "next/link";
import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { getPublicCategories } from "@/lib/categories";
import { buildProductsUrl } from "@/lib/product-filters";
import { publicPageMetadata } from "@/lib/seo";
import { ProductCategoryFilter } from "@/components/products/ProductCategoryFilter";
import { ProductDevelopmentStatusFilter } from "@/components/products/ProductDevelopmentStatusFilter";
import { ProductGrid } from "@/components/products/ProductGrid";
import { AdvertisementBanner } from "@/components/advertisements/AdvertisementBanner";
import { getActiveAdvertisements } from "@/lib/advertisements";
import { SORT_OPTIONS, DEVELOPMENT_STATUS_LABELS } from "@/lib/constants";
import type { PaginatedResponse, Product } from "@/types";

export const metadata: Metadata = publicPageMetadata({
  title: "個人開発アプリ・Webサービス一覧",
  description:
    "個人開発アプリ・無料アプリ・AIツール・Chrome拡張など、ProductBase に掲載されている成果物をカテゴリや人気順で探せます。",
  path: "/products",
  useSiteKeywords: true,
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string; tag?: string; development_status?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort ?? "newest";
  const category = params.category ?? "";
  const tag = params.tag ?? "";
  const developmentStatus = params.development_status ?? "";

  const query = new URLSearchParams({ sort, per_page: "20" });
  if (category) query.set("category", category);
  if (tag) query.set("tag", tag);
  if (developmentStatus) query.set("development_status", developmentStatus);

  const [categories, productsResult, advertisements] = await Promise.all([
    getPublicCategories(),
    serverApi<PaginatedResponse<Product>>(`/public/products?${query.toString()}`).catch(() => ({
      data: [] as Product[],
      pr_products: [] as Product[],
    })),
    getActiveAdvertisements("products"),
  ]);

  const products = productsResult.data;
  const prProducts = productsResult.pr_products ?? [];
  const activeCategory = categories.find((item) => item.slug === category);
  const activeDevelopmentStatus = developmentStatus
    ? DEVELOPMENT_STATUS_LABELS[developmentStatus]
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">成果物一覧</h1>
        {(activeCategory || activeDevelopmentStatus) && (
          <p className="mt-1 text-sm text-zinc-500">
            {activeCategory && <>カテゴリ: {activeCategory.name}</>}
            {activeCategory && activeDevelopmentStatus && " / "}
            {activeDevelopmentStatus && <>開発ステータス: {activeDevelopmentStatus}</>}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">並び順</p>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildProductsUrl({
                sort: opt.value,
                category: category || undefined,
                tag: tag || undefined,
                development_status: developmentStatus || undefined,
              })}
              className={`rounded-full px-3 py-1 text-sm ${
                sort === opt.value
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      <ProductDevelopmentStatusFilter
        activeStatus={developmentStatus || undefined}
        sort={sort}
        category={category || undefined}
        tag={tag || undefined}
      />

      <ProductCategoryFilter
        categories={categories}
        activeSlug={category || undefined}
        sort={sort}
        tag={tag || undefined}
        development_status={developmentStatus || undefined}
      />

      <AdvertisementBanner advertisements={advertisements} />

      <ProductGrid products={products} prProducts={prProducts} />
    </div>
  );
}
