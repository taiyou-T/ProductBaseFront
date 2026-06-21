import { serverApi } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo";
import type { Category, PaginatedResponse, Product } from "@/types";

async function getCategory(slug: string) {
  try {
    const res = await serverApi<{ data: Category }>(`/public/categories/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "カテゴリが見つかりません" };

  return publicPageMetadata({
    title: `${category.name}の成果物`,
    description: `カテゴリ「${category.name}」に分類された成果物一覧`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category: Category | null = null;
  let products: Product[] = [];

  try {
    const catRes = await serverApi<{ data: Category }>(`/public/categories/${slug}`);
    category = catRes.data;
    const prodRes = await serverApi<PaginatedResponse<Product>>(
      `/public/products?category=${slug}&per_page=20`,
    );
    products = prodRes.data;
  } catch {
    category = null;
  }

  if (!category) {
    return <p>カテゴリが見つかりません。</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">カテゴリ: {category.name}</h1>
      <ProductGrid products={products} />
    </div>
  );
}
