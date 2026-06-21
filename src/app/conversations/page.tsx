"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { canAccessChat } from "@/lib/chat-access";
import { getConversationPartnerDisplayName } from "@/lib/conversation-partner";
import { RequireAuth } from "@/components/auth/RequireAuth";
import type { Conversation, PaginatedResponse } from "@/types";

export default function ConversationsPage() {
  const { token, user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !canAccessChat(user)) {
      setLoading(false);
      return;
    }
    api<PaginatedResponse<Conversation>>("/conversations", {}, token)
      .then((res) => setConversations(res.data))
      .catch((e) => setError(getApiErrorMessage(e, "会話を取得できませんでした")))
      .finally(() => setLoading(false));
  }, [token, user]);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">チャット</h1>
        {!canAccessChat(user) ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-medium">チャットを利用するにはプランが必要です</p>
            <p className="mt-2 text-amber-800 dark:text-amber-200">
              {user?.is_creator
                ? "掲載者として返信するには、基本掲載プランへの加入または無料トライアル期間内である必要があります。"
                : "チャットを開始・閲覧するにはサポータープランへの加入が必要です。"}
            </p>
            <Link
              href="/settings/billing"
              className="mt-4 inline-block text-indigo-600 hover:underline dark:text-indigo-400"
            >
              プラン・お支払いへ →
            </Link>
          </div>
        ) : loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : conversations.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
            会話はありません。開発者ページからチャットを開始できます。
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {conversations.map((c) => {
              const partnerName = user
                ? getConversationPartnerDisplayName(c, user.id)
                : "ユーザー";
              const preview = c.messages?.[0]?.message;

              return (
              <li key={c.id}>
                <Link
                  href={`/conversations/${c.id}`}
                  className="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <p className="font-medium">{partnerName}</p>
                  {preview && (
                    <p className="mt-1 truncate text-sm text-zinc-500">{preview}</p>
                  )}
                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(c.created_at).toLocaleString("ja-JP")}
                  </p>
                </Link>
              </li>
              );
            })}
          </ul>
        )}
      </div>
    </RequireAuth>
  );
}
