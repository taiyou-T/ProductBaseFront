"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import type { Conversation } from "@/types";

export function StartChatButton({
  creatorUserId,
  chatStatus,
}: {
  creatorUserId: number;
  chatStatus: "open" | "supporter_only" | "closed";
}) {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (chatStatus === "closed") return null;

  if (!user || !token) {
    return (
      <p className="text-sm text-zinc-500">
        <a href="/login" className="text-indigo-600 hover:underline">
          ログイン
        </a>
        してチャットを開始
      </p>
    );
  }

  if (user.id === creatorUserId) return null;

  if (chatStatus === "supporter_only" && !user.is_supporter) {
    return (
      <p className="text-sm text-zinc-500">
        チャットは{" "}
        <a href="/settings/billing" className="text-indigo-600 hover:underline">
          サポータープラン
        </a>
        限定です
      </p>
    );
  }

  const startChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ conversation: Conversation }>(
        "/conversations",
        {
          method: "POST",
          body: JSON.stringify({ creator_user_id: creatorUserId }),
        },
        token,
      );
      router.push(`/conversations/${res.conversation.id}`);
    } catch (e) {
      setError(getApiErrorMessage(e, "チャットを開始できませんでした"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={startChat} disabled={loading}>
        {loading ? "開始中..." : "チャットを開始"}
      </Button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
