"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function CreatorFavoriteButton({ creatorUserId }: { creatorUserId: number }) {
  const { token, user } = useAuthStore();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api<{ data: { user_id?: number }[] }>("/creator-favorites", {}, token)
      .then((res) => {
        setFavorited(res.data.some((p) => p.user_id === creatorUserId));
      })
      .catch(() => {});
  }, [token, creatorUserId]);

  if (!user || !token) {
    return (
      <p className="text-sm text-zinc-500">
        <a href="/login" className="text-indigo-600 hover:underline">
          ログイン
        </a>
        して開発者をお気に入りに追加
      </p>
    );
  }

  if (user.id === creatorUserId) return null;

  const toggle = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (favorited) {
        await api(`/creator-favorites/${creatorUserId}`, { method: "DELETE" }, token);
        setFavorited(false);
        setMessage("お気に入りを解除しました");
      } else {
        await api(`/creator-favorites/${creatorUserId}`, { method: "POST" }, token);
        setFavorited(true);
        setMessage("開発者をお気に入りに追加しました");
      }
    } catch (e) {
      setMessage(getApiErrorMessage(e, "エラーが発生しました"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button onClick={toggle} disabled={loading} variant="secondary">
        {loading ? "処理中..." : favorited ? "お気に入り解除" : "開発者をお気に入り"}
      </Button>
      {message && <span className="text-sm text-zinc-600 dark:text-zinc-400">{message}</span>}
    </div>
  );
}
