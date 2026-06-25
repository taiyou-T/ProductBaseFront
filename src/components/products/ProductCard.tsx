import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { DEVELOPMENT_STATUS_LABELS } from "@/lib/constants";
import { productPublicPath } from "@/lib/public-paths";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: Product }) {
  const developerSlug = product.user?.creator_profile?.slug;
  const developerName =
    product.user?.creator_profile?.display_name ?? product.user?.name ?? "開発者";

  return (
    <Link
      href={productPublicPath(product)}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
        {product.is_pr_promoted && (
          <span className="absolute left-2 top-2 z-10 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
            PR
          </span>
        )}
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">No image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100">
            {product.title}
          </h3>
          <Badge>{DEVELOPMENT_STATUS_LABELS[product.development_status]}</Badge>
        </div>
        {product.catch_copy && (
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {product.catch_copy}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-zinc-500">
          <span>{developerName}</span>
          <span>{product.view_count} PV · ♥ {product.favorite_count}</span>
        </div>
      </div>
    </Link>
  );
}
