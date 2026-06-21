"use client";

import { useEffect } from "react";
import { useSiteConfigStore } from "@/lib/site-config-store";

export default function TermsPage() {
  const { config, load } = useSiteConfigStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">利用規約</h1>
      {config?.terms_content ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm whitespace-pre-wrap dark:border-zinc-800 dark:bg-zinc-900">
          {config.terms_content}
        </div>
      ) : (
        <p className="text-zinc-500">利用規約は準備中です。</p>
      )}
      {config?.terms_version && (
        <p className="text-xs text-zinc-500">バージョン: v{config.terms_version}</p>
      )}
    </div>
  );
}
