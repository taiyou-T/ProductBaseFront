import Link from "next/link";
import { buildProductsUrl } from "@/lib/product-filters";
import type { Category } from "@/types";

const chipClass = (active: boolean) =>
  active
    ? "bg-indigo-600 text-white"
    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

export function ProductCategoryFilter({
  categories,
  activeSlug,
  sort,
  tag,
  development_status,
}: {
  categories: Category[];
  activeSlug?: string;
  sort?: string;
  tag?: string;
  development_status?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">カテゴリ</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildProductsUrl({ sort, tag, development_status })}
          className={`rounded-full px-3 py-1 text-sm ${chipClass(!activeSlug)}`}
        >
          すべて
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildProductsUrl({ sort, category: category.slug, tag, development_status })}
            className={`rounded-full px-3 py-1 text-sm ${chipClass(activeSlug === category.slug)}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
