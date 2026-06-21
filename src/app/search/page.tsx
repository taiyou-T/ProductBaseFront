import { serverApi } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/Input";
import type { PaginatedResponse, Product } from "@/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const sort = params.sort ?? "newest";

  let products: Product[] = [];
  if (q) {
    try {
      const query = new URLSearchParams({ q, sort, per_page: "20" });
      const res = await serverApi<PaginatedResponse<Product>>(
        `/public/products?${query.toString()}`,
        0,
      );
      products = res.data;
    } catch {
      products = [];
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">成果物を検索</h1>
      <form action="/search" method="GET" className="flex gap-2">
        <Input
          name="q"
          defaultValue={q}
          placeholder="キーワード（React, Laravel など）"
          className="flex-1"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
        >
          検索
        </button>
      </form>
      {q && (
        <p className="text-sm text-zinc-500">
          「{q}」の検索結果: {products.length} 件
        </p>
      )}
      <ProductGrid products={products} />
    </div>
  );
}
