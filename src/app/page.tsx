import Link from "next/link";
import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebSiteJsonLd } from "@/lib/seo-jsonld";
import { publicPageMetadata } from "@/lib/seo";
import { AnnouncementList } from "@/components/announcements/AnnouncementList";
import { AdvertisementBanner } from "@/components/advertisements/AdvertisementBanner";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HomeHeroActions } from "@/components/home/HomeHeroActions";
import { getActiveAdvertisements } from "@/lib/advertisements";
import { mergePrProducts } from "@/lib/product-listing";
import type { Announcement, PaginatedResponse, Product } from "@/types";

export const metadata: Metadata = publicPageMetadata({
  title: "個人開発アプリの掲載・ポートフォリオプラットフォーム",
  description:
    "個人開発アプリやスタートアップの成果物を掲載・公開・宣伝できるプラットフォーム。新着成果物や人気ランキングから、便利なWebサービスや日本製アプリを探せます。",
  path: "/",
  useSiteKeywords: true,
});

async function getHomeData() {
  try {
    const [newest, popular, announcements, advertisements] = await Promise.all([
      serverApi<PaginatedResponse<Product>>("/public/products?sort=newest&per_page=6"),
      serverApi<{ type: string; data: Product[]; pr_products?: Product[] }>(
        "/public/rankings?type=popular&limit=6",
      ),
      serverApi<PaginatedResponse<Announcement>>("/public/announcements?per_page=3"),
      getActiveAdvertisements("home"),
    ]);
    return { newest, popular, announcements, advertisements, error: null };
  } catch {
    return {
      newest: { data: [], pr_products: [], meta: { current_page: 1, last_page: 1, per_page: 6, total: 0 } },
      popular: { type: "popular", data: [] },
      announcements: { data: [], meta: { current_page: 1, last_page: 1, per_page: 3, total: 0 } },
      advertisements: [],
      error: "API に接続できません。バックエンドが起動しているか確認してください。",
    };
  }
}

export default async function HomePage() {
  const { newest, popular, announcements, advertisements, error } = await getHomeData();
  const newestProducts = mergePrProducts(newest.data, newest.pr_products);

  return (
    <div className="space-y-12">
      <JsonLd data={buildWebSiteJsonLd()} />
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

      <AdvertisementBanner advertisements={advertisements} />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">新着成果物</h2>
          <Link href="/products" className="text-sm text-indigo-600 hover:underline">
            すべて見る
          </Link>
        </div>
        <ProductGrid products={newestProducts} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">人気ランキング</h2>
        </div>
        <ProductGrid products={popular.data} />
      </section>

      <AnnouncementList announcements={announcements.data} />
    </div>
  );
}
