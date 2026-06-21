"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Product } from "@/types";

export default function ViewHistoryPage() {
  const { token, user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api<{ data: Product[] }>("/view-history", {}, token)
      .then((res) => setProducts(res.data))
      .catch((e) => {
        setError(getApiErrorMessage(e, "閲覧履歴を取得できませんでした"));
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">閲覧履歴</h1>
        {!user?.is_supporter && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            閲覧履歴はサポータープラン限定です。{" "}
            <a href="/settings/billing" className="text-indigo-600 hover:underline">
              プランを確認
            </a>
          </p>
        )}
        {loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </RequireAuth>
  );
}
