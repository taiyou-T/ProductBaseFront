"use client";

import { forwardRef, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category } from "@/types";

const selectClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100";

type CategorySelectProps = {
  label?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.ChangeEventHandler<HTMLSelectElement>;
  name?: string;
  disabled?: boolean;
};

export const CategorySelect = forwardRef<HTMLSelectElement, CategorySelectProps>(
  function CategorySelect(
    { label = "カテゴリ", value = "", onChange, onBlur, name, disabled },
    ref,
  ) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      api<{ data: Category[] }>("/public/categories")
        .then((res) => setCategories(res.data))
        .catch(() => setError("カテゴリの取得に失敗しました"))
        .finally(() => setLoading(false));
    }, []);

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          name={name}
          value={loading ? "" : value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled || loading}
          className={selectClassName}
        >
          <option value="">{loading ? "読み込み中..." : "未選択"}</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
