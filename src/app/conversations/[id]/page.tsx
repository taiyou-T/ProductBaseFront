"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/Button";
import type { Conversation } from "@/types";

export default function ConversationDetailPage() {
  const params = useParams<{ id: string }>();
  const { token, user } = useAuthStore();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!token) return;
    api<{ data: Conversation }>(`/conversations/${params.id}`, {}, token)
      .then((res) => setConversation(res.data))
      .catch((e) => setError(getApiErrorMessage(e, "会話を取得できませんでした")))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token, params.id]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !message.trim()) return;
    setSending(true);
    setError(null);
    try {
      await api(
        `/conversations/${params.id}/messages`,
        { method: "POST", body: JSON.stringify({ message: message.trim() }) },
        token,
      );
      setMessage("");
      load();
    } catch (e) {
      setError(getApiErrorMessage(e, "送信に失敗しました"));
    } finally {
      setSending(false);
    }
  };

  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/conversations" className="text-sm text-indigo-600 hover:underline">
          ← 会話一覧
        </Link>
        <h1 className="text-2xl font-bold">チャット</h1>
        {loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : error && !conversation ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="max-h-96 space-y-3 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              {(conversation?.messages ?? []).length === 0 ? (
                <p className="text-center text-sm text-zinc-500">メッセージはまだありません</p>
              ) : (
                conversation?.messages?.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-lg p-3 text-sm ${
                      m.sender_user_id === user?.id
                        ? "ml-8 bg-indigo-100 dark:bg-indigo-950/40"
                        : "mr-8 bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  >
                    <p>{m.message}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {new Date(m.created_at).toLocaleString("ja-JP")}
                    </p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={send} className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000}
                placeholder="メッセージを入力..."
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <Button type="submit" disabled={sending || !message.trim()}>
                {sending ? "送信中..." : "送信"}
              </Button>
            </form>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </>
        )}
      </div>
    </RequireAuth>
  );
}
