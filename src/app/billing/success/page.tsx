"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

export default function BillingSuccessPage() {
  const { token, refreshUser } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    api("/subscriptions", {}, token).catch(() => undefined);
    refreshUser().catch(() => undefined);
  }, [token, refreshUser]);

  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-bold">お支払いが完了しました</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        プラン情報を反映しました。プラン画面で加入状況を確認できます。
      </p>
      <Link href="/settings/billing" className="inline-block text-indigo-600 hover:underline">
        プラン設定に戻る
      </Link>
    </div>
  );
}
