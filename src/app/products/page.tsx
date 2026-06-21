import Link from "next/link";
import { serverApi } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SORT_OPTIONS } from "@/lib/constants";
import type { PaginatedResponse, Product } from "@/types";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort ?? "newest";
  const query = new URLSearchParams({ sort, per_page: "20" });
  if (params.category) query.set("category", params.category);
  if (params.tag) query.set("tag", params.tag);

  let products: Product[] = [];
  try {
    const res = await serverApi<PaginatedResponse<Product>>(
      `/public/products?${query.toString()}`,
    );
    products = res.data;
  } catch {
    products = [];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">成果物一覧</h1>
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={`/products?sort=${opt.value}`}
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
      <ProductGrid products={products} />
    </div>
  );
}
