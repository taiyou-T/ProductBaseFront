"use client";

import Link from "next/link";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useAuthStore } from "@/lib/auth-store";
import { canAccessChat } from "@/lib/chat-access";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthRedirect();
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated) {
    return <p className="text-zinc-500">読み込み中...</p>;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-56">
        <nav className="space-y-1 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="px-2 py-1 text-sm font-medium text-zinc-500">{user?.name}</p>
          <Link href="/dashboard" className="block rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            概要
          </Link>
          <Link href="/dashboard/products" className="block rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            成果物
          </Link>
          <Link href="/dashboard/profile" className="block rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            プロフィール
          </Link>
          {canAccessChat(user) && (
            <Link href="/conversations" className="block rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
              チャット
            </Link>
          )}
          <Link href="/dashboard/organizations" className="block rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            団体
          </Link>
          <Link href="/settings/billing" className="block rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            プラン・お支払い
          </Link>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
