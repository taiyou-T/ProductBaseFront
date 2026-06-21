"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { ButtonLink } from "@/components/ui/Button";
import { APPROVAL_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import type { PaginatedResponse, Product } from "@/types";

export default function DashboardProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = () => {
    if (!token) return;
    setLoading(true);
    api<PaginatedResponse<Product>>("/creator/products", {}, token)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const deleteDraft = async (product: Product) => {
    if (!token || product.approval_status !== "draft") return;
    if (!window.confirm(`「${product.title}」を削除します。元に戻せません。`)) return;

    setDeletingId(product.id);
    setError(null);
    try {
      await api(`/creator/products/${product.id}`, { method: "DELETE" }, token);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (e) {
      setError(getApiErrorMessage(e, "削除に失敗しました"));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">成果物管理</h1>
        <ButtonLink href="/dashboard/products/new">新規作成</ButtonLink>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {products.length === 0 ? (
        <p className="text-zinc-500">成果物がありません。</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <span className="font-medium">{p.title}</span>
                {p.approval_status && (
                  <span className="ml-2">
                    <Badge>{APPROVAL_STATUS_LABELS[p.approval_status]}</Badge>
                  </span>
                )}
                {p.is_published && (
                  <Link href={`/products/${p.slug}`} className="ml-2 text-sm text-indigo-600">
                    公開ページ
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/dashboard/products/${p.id}/edit`} className="text-sm text-indigo-600">
                  編集
                </Link>
                {p.approval_status === "draft" && (
                  <button
                    type="button"
                    className="text-sm text-red-600 disabled:opacity-50"
                    disabled={deletingId === p.id}
                    onClick={() => deleteDraft(p)}
                  >
                    {deletingId === p.id ? "削除中..." : "削除"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
