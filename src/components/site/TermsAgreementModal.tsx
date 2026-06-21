"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/Button";

export function TermsAgreementModal({
  termsContent,
  onLogout,
}: {
  termsContent: string;
  onLogout: () => void;
}) {
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!token || !agreed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ user: import("@/types").User }>("/auth/terms/agree", {
        method: "POST",
      }, token);
      setAuth(token, res.user);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "同意の送信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-xl font-bold">利用規約の確認</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          利用規約が更新されました。続行するには最新の利用規約に同意してください。
        </p>
        <div className="mt-4 max-h-64 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm whitespace-pre-wrap dark:border-zinc-700 dark:bg-zinc-950">
          {termsContent}
        </div>
        <label className="mt-4 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>利用規約に同意します</span>
        </label>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={submit} disabled={!agreed || loading}>
            {loading ? "送信中..." : "同意して続行"}
          </Button>
          <Button variant="ghost" onClick={onLogout}>
            ログアウト
          </Button>
        </div>
      </div>
    </div>
  );
}
