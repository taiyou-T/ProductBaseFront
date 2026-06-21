"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { ButtonLink } from "@/components/ui/Button";
import { APPROVAL_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import type { PaginatedResponse, Product } from "@/types";

export default function DashboardPage() {
  const { token, user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!token || !user?.is_creator) return;
    api<PaginatedResponse<Product>>("/creator/products?per_page=5", {}, token)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [token, user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>

      {!user?.is_creator && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <p className="font-medium">掲載者プロフィールを作成して成果物を掲載しましょう。</p>
          <ButtonLink href="/dashboard/onboarding" className="mt-3">
            プロフィールを作成
          </ButtonLink>
        </div>
      )}

      {user?.is_creator && user.creator_profile?.can_list === false && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-medium">無料トライアル期間が終了しています</p>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            掲載申請や公開一覧への表示には基本掲載プランの契約が必要です。
          </p>
          <ButtonLink href="/settings/billing" className="mt-3" variant="secondary">
            プランを確認する
          </ButtonLink>
        </div>
      )}

      {user?.is_creator && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">最近の成果物</h2>
            <ButtonLink href="/dashboard/products/new" variant="secondary">
              新規作成
            </ButtonLink>
          </div>
          {products.length === 0 ? (
            <p className="text-zinc-500">まだ成果物がありません。</p>
          ) : (
            <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {products.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <Link href={`/dashboard/products/${p.id}/edit`} className="font-medium hover:text-indigo-600">
                      {p.title}
                    </Link>
                    {p.approval_status && (
                      <span className="ml-2">
                        <Badge variant={p.approval_status === "approved" ? "success" : "default"}>
                          {APPROVAL_STATUS_LABELS[p.approval_status]}
                        </Badge>
                      </span>
                    )}
                  </div>
                  <Link href={`/dashboard/products/${p.id}/edit`} className="text-sm text-indigo-600">
                    編集
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
