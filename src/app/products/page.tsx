import Link from "next/link";
import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { getPublicCategories } from "@/lib/categories";
import { buildProductsUrl } from "@/lib/product-filters";
import { publicPageMetadata } from "@/lib/seo";
import { ProductCategoryFilter } from "@/components/products/ProductCategoryFilter";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SORT_OPTIONS } from "@/lib/constants";
import type { PaginatedResponse, Product } from "@/types";

export const metadata: Metadata = publicPageMetadata({
  title: "成果物一覧",
  description: "ProductBase に掲載されている個人開発・スタートアップの成果物一覧です。",
  path: "/products",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort ?? "newest";
  const category = params.category ?? "";
  const tag = params.tag ?? "";

  const query = new URLSearchParams({ sort, per_page: "20" });
  if (category) query.set("category", category);
  if (tag) query.set("tag", tag);

  const [categories, productsResult] = await Promise.all([
    getPublicCategories(),
    serverApi<PaginatedResponse<Product>>(`/public/products?${query.toString()}`).catch(() => ({
      data: [] as Product[],
    })),
  ]);

  const products = productsResult.data;
  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">成果物一覧</h1>
        {activeCategory && (
          <p className="mt-1 text-sm text-zinc-500">
            カテゴリ: {activeCategory.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">並び順</p>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildProductsUrl({ sort: opt.value, category: category || undefined, tag: tag || undefined })}
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

      <ProductCategoryFilter
        categories={categories}
        activeSlug={category || undefined}
        sort={sort}
        tag={tag || undefined}
      />

      <ProductGrid products={products} />
    </div>
  );
}
