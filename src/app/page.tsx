import Link from "next/link";
import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { publicPageMetadata } from "@/lib/seo";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HomeHeroActions } from "@/components/home/HomeHeroActions";
import type { Announcement, PaginatedResponse, Product } from "@/types";

export const metadata: Metadata = publicPageMetadata({
  title: "ProductBase",
  description:
    "個人開発者・スタートアップの成果物を掲載し、SEO で発信するプラットフォーム。新着成果物や人気ランキングからプロダクトを探せます。",
  path: "/",
});

async function getHomeData() {
  try {
    const [newest, popular, announcements] = await Promise.all([
      serverApi<PaginatedResponse<Product>>("/public/products?sort=newest&per_page=6"),
      serverApi<{ type: string; data: Product[] }>("/public/rankings?type=popular&limit=6"),
      serverApi<PaginatedResponse<Announcement>>("/public/announcements?per_page=3"),
    ]);
    return { newest, popular, announcements, error: null };
  } catch {
    return {
      newest: { data: [], meta: { current_page: 1, last_page: 1, per_page: 6, total: 0 } },
      popular: { type: "popular", data: [] },
      announcements: { data: [], meta: { current_page: 1, last_page: 1, per_page: 3, total: 0 } },
      error: "API に接続できません。バックエンドが起動しているか確認してください。",
    };
  }
}

export default async function HomePage() {
  const { newest, popular, announcements, error } = await getHomeData();

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-12 text-white shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          作った成果物を、もっと広げる
        </h1>
        <p className="mt-4 max-w-2xl text-indigo-100">
          ProductBase は個人開発者・スタートアップ向けの成果物掲載プラットフォームです。
          SEO を意識した公開ページで、あなたのプロダクトを継続的に発信できます。
        </p>
        <HomeHeroActions />
      </section>

      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          {error}
          <p className="mt-1 text-sm">
            開発時は ProductBaseBack で <code className="rounded bg-amber-100 px-1">php artisan serve</code> を実行してください。
          </p>
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">新着成果物</h2>
          <Link href="/products" className="text-sm text-indigo-600 hover:underline">
            すべて見る
          </Link>
        </div>
        <ProductGrid products={newest.data} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">人気ランキング</h2>
        </div>
        <ProductGrid products={popular.data} />
      </section>

      {announcements.data.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">お知らせ</h2>
          <ul className="space-y-3">
            {announcements.data.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="font-medium">{a.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {a.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
