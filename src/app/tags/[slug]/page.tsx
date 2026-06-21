import { serverApi } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo";
import type { PaginatedResponse, Product, Tag } from "@/types";

async function getTag(slug: string) {
  try {
    const res = await serverApi<{ data: Tag }>(`/public/tags/${slug}`);
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
  const tag = await getTag(slug);
  if (!tag) return { title: "タグが見つかりません" };

  return publicPageMetadata({
    title: `#${tag.name} の成果物`,
    description: `タグ「${tag.name}」が付いた成果物一覧`,
    path: `/tags/${slug}`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let tag: Tag | null = null;
  let products: Product[] = [];

  try {
    const tagRes = await serverApi<{ data: Tag }>(`/public/tags/${slug}`);
    tag = tagRes.data;
    const prodRes = await serverApi<PaginatedResponse<Product>>(
      `/public/products?tag=${slug}&per_page=20`,
    );
    products = prodRes.data;
  } catch {
    tag = null;
  }

  if (!tag) {
    return <p>タグが見つかりません。</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">タグ: #{tag.name}</h1>
      <ProductGrid products={products} />
    </div>
  );
}
