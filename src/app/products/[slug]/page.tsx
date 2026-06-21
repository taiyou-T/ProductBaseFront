import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { publicPageMetadata } from "@/lib/seo";
import { DEVELOPMENT_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { ReportButton } from "@/components/products/ReportButton";
import { DeveloperActions } from "@/components/developers/DeveloperActions";
import type { Product } from "@/types";

async function getProduct(slug: string) {
  try {
    const res = await serverApi<{ data: Product }>(`/public/products/${slug}`);
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
  const product = await getProduct(slug);
  if (!product) return { title: "成果物が見つかりません" };

  return publicPageMetadata({
    title: product.title,
    description: product.catch_copy ?? product.description ?? product.title,
    path: `/products/${product.slug}`,
    image: product.thumbnail_url,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const developer = product.user?.creator_profile;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.title,
    description: product.description ?? product.catch_copy,
    url: product.service_url,
    image: product.thumbnail_url,
    applicationCategory: product.category?.name,
  };

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          {product.thumbnail_url && (
            <Image
              src={product.thumbnail_url}
              alt={product.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{DEVELOPMENT_STATUS_LABELS[product.development_status]}</Badge>
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm text-indigo-600 hover:underline"
              >
                {product.category.name}
              </Link>
            )}
          </div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          {product.catch_copy && (
            <p className="text-lg text-zinc-600 dark:text-zinc-400">{product.catch_copy}</p>
          )}
          {developer && (
            <p className="text-sm">
              開発者:{" "}
              <Link href={`/developers/${developer.slug}`} className="text-indigo-600 hover:underline">
                {developer.display_name}
              </Link>
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
            <span>{product.view_count} PV</span>
            <span>♥ {product.favorite_count}</span>
          </div>
          <FavoriteButton productId={product.id} />
          {developer && product.user && (
            <DeveloperActions
              creatorUserId={product.user.id}
              chatStatus={developer.chat_status}
            />
          )}
          <ReportButton productId={product.id} />
          <div className="flex flex-wrap gap-3">
            {product.service_url && (
              <a
                href={product.service_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
              >
                サービスを開く
              </a>
            )}
            {product.github_url && (
              <a
                href={product.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700"
              >
                GitHub
              </a>
            )}
          </div>
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {product.description && (
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold">概要</h2>
          <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
            {product.description}
          </p>
        </section>
      )}

      {product.story && (
        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">開発ストーリー</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {product.story.target_users && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">ターゲット</dt>
                <dd>{product.story.target_users}</dd>
              </div>
            )}
            {product.story.solved_problem && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">解決する課題</dt>
                <dd>{product.story.solved_problem}</dd>
              </div>
            )}
            {product.story.main_features && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">主な機能</dt>
                <dd>{product.story.main_features}</dd>
              </div>
            )}
            {product.story.motivation && (
              <div>
                <dt className="text-sm font-medium text-zinc-500">開発のきっかけ</dt>
                <dd>{product.story.motivation}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {product.images.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">スクリーンショット</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.images.map((img) => (
              <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={img.image_url} alt="" fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
