"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function FavoriteButton({
  productId,
  ownerUserId,
}: {
  productId: number;
  ownerUserId?: number;
}) {
  const { token, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  const addFavorite = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await api(`/favorites/${productId}`, { method: "POST" }, token);
      setMessage("お気に入りに追加しました");
    } catch (e) {
      setMessage(getApiErrorMessage(e, "エラーが発生しました"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button onClick={addFavorite} disabled={loading} variant="secondary">
        {loading ? "追加中..." : "お気に入りに追加"}
      </Button>
      {message && <span className="text-sm text-zinc-600 dark:text-zinc-400">{message}</span>}
    </div>
  );
}
