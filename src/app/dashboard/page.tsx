"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { ButtonLink } from "@/components/ui/Button";
import { APPROVAL_STATUS_LABELS } from "@/lib/constants";
import {
  CREATOR_PLAN_LABELS,
  formatListingSubmissionUsage,
  formatTrialEndDate,
  trialDaysRemaining,
} from "@/lib/creator-plan";
import { Badge } from "@/components/ui/Badge";
import type { PaginatedResponse, Product } from "@/types";

export default function DashboardPage() {
  const { token, user, refreshUser } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!token) return;
    refreshUser().catch(() => undefined);
  }, [token, refreshUser]);

  useEffect(() => {
    if (!token || !user?.is_creator) return;
    api<PaginatedResponse<Product>>("/creator/products?per_page=5", {}, token)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [token, user]);

  const profile = user?.creator_profile;
  const isOnTrial = profile?.plan_type === "free_trial" && profile.can_list !== false;

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
          {profile?.trial_ends_at && (
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              トライアル終了日: {formatTrialEndDate(profile.trial_ends_at)}
            </p>
          )}
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            掲載申請や公開一覧への表示には基本掲載プランの契約が必要です。
          </p>
          <ButtonLink href="/settings/billing" className="mt-3" variant="secondary">
            プランを確認する
          </ButtonLink>
        </div>
      )}

      {user?.is_creator && isOnTrial && profile?.trial_ends_at && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm dark:border-indigo-900 dark:bg-indigo-950/30">
          <p className="font-medium text-indigo-900 dark:text-indigo-100">
            {CREATOR_PLAN_LABELS.free_trial}期間中
          </p>
          <p className="mt-1 text-indigo-800 dark:text-indigo-200">
            終了日: {formatTrialEndDate(profile.trial_ends_at)}
            （残り {trialDaysRemaining(profile.trial_ends_at)} 日）
          </p>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            トライアル終了後は基本掲載プラン（¥500/月）の契約が必要です。
          </p>
          <Link
            href="/settings/billing"
            className="mt-2 inline-block text-indigo-600 hover:underline dark:text-indigo-400"
          >
            プラン・課金設定を見る
          </Link>
        </div>
      )}

      {user?.is_creator && profile && (
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {profile.plan_type !== "free_trial" && (
              <p>
                <span className="text-zinc-500">掲載プラン: </span>
                <span className="font-medium">{CREATOR_PLAN_LABELS[profile.plan_type]}</span>
              </p>
            )}
            <p>
              <span className="text-zinc-500">掲載申請枠: </span>
              <span className="font-medium">{formatListingSubmissionUsage(profile)}</span>
            </p>
          </div>
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
