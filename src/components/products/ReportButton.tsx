"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api, getApiErrorMessage } from "@/lib/api";
import { REPORT_REASONS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import type { ReportReason } from "@/types";

export function ReportButton({ productId }: { productId: number }) {
  const { token, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("spam");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user || !token) return null;

  const submit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api<{ message: string }>(
        `/reports/${productId}`,
        {
          method: "POST",
          body: JSON.stringify({ reason, detail: detail || undefined }),
        },
        token,
      );
      setMessage(res.message);
      setOpen(false);
    } catch (e) {
      setMessage(getApiErrorMessage(e, "通報に失敗しました"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)} className="!px-2 !py-1 text-sm">
        通報
      </Button>
      {message && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">成果物を通報</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium">理由</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium">詳細（任意）</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                maxLength={2000}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button type="button" onClick={submit} disabled={loading}>
                {loading ? "送信中..." : "通報する"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
