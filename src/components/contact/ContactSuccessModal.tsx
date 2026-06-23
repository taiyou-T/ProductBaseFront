"use client";

import { Button } from "@/components/ui/Button";

export function ContactSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-success-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 id="contact-success-title" className="text-xl font-bold">
          お問い合わせを受け付けました
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          お問い合わせを受け付けました。内容は順次確認いたします。返信が必要な場合のみ、メールでご連絡することがあります。
        </p>
        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
}
