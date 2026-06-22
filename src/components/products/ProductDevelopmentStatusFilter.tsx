import Link from "next/link";
import { DEVELOPMENT_STATUS_LABELS } from "@/lib/constants";
import { buildProductsUrl } from "@/lib/product-filters";

const chipClass = (active: boolean) =>
  active
    ? "bg-indigo-600 text-white"
    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

export function ProductDevelopmentStatusFilter({
  activeStatus,
  sort,
  category,
  tag,
}: {
  activeStatus?: string;
  sort?: string;
  category?: string;
  tag?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">開発ステータス</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildProductsUrl({ sort, category, tag })}
          className={`rounded-full px-3 py-1 text-sm ${chipClass(!activeStatus)}`}
        >
          すべて
        </Link>
        {Object.entries(DEVELOPMENT_STATUS_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={buildProductsUrl({ sort, category, tag, development_status: value })}
            className={`rounded-full px-3 py-1 text-sm ${chipClass(activeStatus === value)}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
