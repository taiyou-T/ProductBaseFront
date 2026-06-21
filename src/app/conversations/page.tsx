"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/auth/RequireAuth";
import type { Conversation, PaginatedResponse } from "@/types";

export default function ConversationsPage() {
  const { token } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api<PaginatedResponse<Conversation>>("/conversations", {}, token)
      .then((res) => setConversations(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">チャット</h1>
        {loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : conversations.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
            会話はありません。開発者ページからチャットを開始できます。
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/conversations/${c.id}`}
                  className="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <p className="font-medium">会話 #{c.id}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(c.created_at).toLocaleString("ja-JP")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </RequireAuth>
  );
}
