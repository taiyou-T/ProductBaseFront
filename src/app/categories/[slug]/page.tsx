import { serverApi } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Metadata } from "next";
import { publicPageMetadata, buildMetaDescription } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/seo-jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
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
    title: `${category.name}の個人開発アプリ一覧`,
    description: buildMetaDescription(
      `カテゴリ「${category.name}」に掲載された個人開発アプリ・Webサービスの一覧。`,
      "ProductBase で公開中の成果物を探せます。",
    ),
    path: `/categories/${slug}`,
    keywords: [category.name, "個人開発アプリ", category.slug],
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
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "成果物一覧", path: "/products" },
          { name: category.name, path: `/categories/${slug}` },
        ])}
      />
      <h1 className="text-2xl font-bold">{category.name}の個人開発アプリ</h1>
      <ProductGrid products={products} />
    </div>
  );
}
