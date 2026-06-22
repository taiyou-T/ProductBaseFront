import { SORT_OPTIONS } from "@/lib/constants";
import type { Category } from "@/types";

const fieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100";

export function ProductSearchForm({
  q = "",
  category = "",
  sort = "newest",
  categories,
}: {
  q?: string;
  category?: string;
  sort?: string;
  categories: Category[];
}) {
  return (
    <form action="/search" method="GET" className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="product-search-q" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          キーワード
        </label>
        <input
          id="product-search-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="作品名・説明・ストーリー・タグ・開発者名で検索"
          className={`${fieldClassName} py-2.5 text-base sm:text-sm`}
        />
        <p className="text-xs text-zinc-500">
          部分一致で検索します。カテゴリだけの絞り込みもできます。
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="w-full sm:w-48">
          <label htmlFor="product-search-category" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            カテゴリ
          </label>
          <select
            id="product-search-category"
            name="category"
            defaultValue={category}
            className={fieldClassName}
          >
            <option value="">すべて</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-40">
          <label htmlFor="product-search-sort" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            並び順
          </label>
          <select id="product-search-sort" name="sort" defaultValue={sort} className={fieldClassName}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 sm:w-auto"
        >
          検索
        </button>
      </div>
    </form>
  );
}
