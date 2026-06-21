"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { user, token, clearAuth, hydrated } = useAuthStore();

  const handleLogout = async () => {
    try {
      if (token) {
        await api("/auth/logout", { method: "POST" }, token);
      }
    } finally {
      clearAuth();
    }
  };

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          {SITE_NAME}
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/products" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            成果物
          </Link>
          <Link href="/search" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            検索
          </Link>
          {hydrated && user && (
            <>
              <Link href="/favorites" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
                お気に入り
              </Link>
              <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
                ダッシュボード
              </Link>
            </>
          )}
          {hydrated && !user && (
            <>
              <Link href="/login" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
                ログイン
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
              >
                登録
              </Link>
            </>
          )}
          {hydrated && user && (
            <Button variant="ghost" onClick={handleLogout} className="!px-2 !py-1">
              ログアウト
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
