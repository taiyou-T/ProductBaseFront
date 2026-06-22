"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import type { PaginatedResponse, Product } from "@/types";

export function FavoriteButton({
  productId,
  ownerUserId,
}: {
  productId: number;
  ownerUserId?: number;
}) {
  const { token, user } = useAuthStore();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }

    api<PaginatedResponse<Product>>("/favorites?per_page=100", {}, token)
      .then((res) => {
        setFavorited(res.data.some((product) => product.id === productId));
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [token, productId]);

  if (!user || !token) {
    return (
      <p className="text-sm text-zinc-500">
        <a href="/login" className="text-indigo-600 hover:underline">ログイン</a>してお気に入りに追加
      </p>
    );
  }

  if (ownerUserId !== undefined && ownerUserId === user.id) {
    return null;
  }

  const toggleFavorite = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (favorited) {
        await api(`/favorites/${productId}`, { method: "DELETE" }, token);
        setFavorited(false);
        setMessage("お気に入りを解除しました");
      } else {
        await api(`/favorites/${productId}`, { method: "POST" }, token);
        setFavorited(true);
        setMessage("お気に入りに追加しました");
      }
    } catch (e) {
      setMessage(getApiErrorMessage(e, "エラーが発生しました"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button onClick={toggleFavorite} disabled={loading || checking} variant="secondary">
        {loading ? "処理中..." : checking ? "確認中..." : favorited ? "お気に入り登録済" : "お気に入りに追加"}
      </Button>
      {message && <span className="text-sm text-zinc-600 dark:text-zinc-400">{message}</span>}
    </div>
  );
}
