"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { developerPublicPath } from "@/lib/public-paths";
import { RequireAuth } from "@/components/auth/RequireAuth";
import type { CreatorProfile } from "@/types";

export default function CreatorFavoritesPage() {
  const { token } = useAuthStore();
  const [profiles, setProfiles] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api<{ data: CreatorProfile[] }>("/creator-favorites", {}, token)
      .then((res) => setProfiles(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">お気に入り開発者</h1>
        {loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : profiles.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
            お気に入りの開発者はいません
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {profiles.map((p) => (
              <li key={p.id}>
                <Link
                  href={developerPublicPath(p)}
                  className="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <p className="font-medium">{p.display_name}</p>
                  {p.bio && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {p.bio}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </RequireAuth>
  );
}
