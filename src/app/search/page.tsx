import { serverApi } from "@/lib/api";
import { getPublicCategories } from "@/lib/categories";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSearchForm } from "@/components/products/ProductSearchForm";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo";
import { DEVELOPMENT_STATUS_LABELS } from "@/lib/constants";
import type { PaginatedResponse, Product } from "@/types";

export const metadata: Metadata = publicPageMetadata({
  title: "検索",
  description: "ProductBase の成果物をキーワードやカテゴリで検索できます。",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; category?: string; development_status?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sort = params.sort ?? "newest";
  const category = params.category ?? "";
  const developmentStatus = params.development_status ?? "";
  const hasFilters = Boolean(q || category || developmentStatus);

  const categories = await getPublicCategories();

  let products: Product[] = [];
  if (hasFilters) {
    try {
      const query = new URLSearchParams({ sort, per_page: "20" });
      if (q) query.set("q", q);
      if (category) query.set("category", category);
      if (developmentStatus) query.set("development_status", developmentStatus);
      const res = await serverApi<PaginatedResponse<Product>>(
        `/public/products?${query.toString()}`,
        0,
      );
      products = res.data;
    } catch {
      products = [];
    }
  }

  const activeCategory = categories.find((item) => item.slug === category);
  const activeDevelopmentStatus = developmentStatus
    ? DEVELOPMENT_STATUS_LABELS[developmentStatus]
    : undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">成果物を検索</h1>
      <ProductSearchForm
        q={q}
        category={category}
        development_status={developmentStatus}
        sort={sort}
        categories={categories}
      />
      {hasFilters && (
        <p className="text-sm text-zinc-500">
          {q && <>「{q}」</>}
          {q && (activeCategory || activeDevelopmentStatus) && " / "}
          {activeCategory && <>カテゴリ: {activeCategory.name}</>}
          {activeCategory && activeDevelopmentStatus && " / "}
          {activeDevelopmentStatus && <>開発ステータス: {activeDevelopmentStatus}</>}
          {!q && !activeCategory && !activeDevelopmentStatus && "条件"}
          の検索結果: {products.length} 件
        </p>
      )}
      {hasFilters ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-sm text-zinc-500">
          キーワード、カテゴリ、または開発ステータスを指定して検索してください。
        </p>
      )}
    </div>
  );
}
