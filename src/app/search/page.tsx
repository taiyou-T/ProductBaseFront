import { serverApi } from "@/lib/api";
import { getPublicCategories } from "@/lib/categories";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSearchForm } from "@/components/products/ProductSearchForm";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo";
import type { PaginatedResponse, Product } from "@/types";

export const metadata: Metadata = publicPageMetadata({
  title: "検索",
  description: "ProductBase の成果物をキーワードやカテゴリで検索できます。",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sort = params.sort ?? "newest";
  const category = params.category ?? "";
  const hasFilters = Boolean(q || category);

  const categories = await getPublicCategories();

  let products: Product[] = [];
  if (hasFilters) {
    try {
      const query = new URLSearchParams({ sort, per_page: "20" });
      if (q) query.set("q", q);
      if (category) query.set("category", category);
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">成果物を検索</h1>
      <ProductSearchForm
        q={q}
        category={category}
        sort={sort}
        categories={categories}
      />
      {hasFilters && (
        <p className="text-sm text-zinc-500">
          {q && <>「{q}」</>}
          {q && activeCategory && " / "}
          {activeCategory && <>カテゴリ: {activeCategory.name}</>}
          {!q && !activeCategory && "条件"}
          の検索結果: {products.length} 件
        </p>
      )}
      {hasFilters ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-sm text-zinc-500">
          キーワードまたはカテゴリを指定して検索してください。
        </p>
      )}
    </div>
  );
}
