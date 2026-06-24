"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { productPublicPath } from "@/lib/public-paths";
import { absoluteUrl } from "@/lib/seo";
import type { Product } from "@/types";

export function ProductShareLinkButton({
  product,
}: {
  product: Pick<Product, "id" | "slug">;
}) {
  const [message, setMessage] = useState<string | null>(null);

  const copyLink = async () => {
    const url = absoluteUrl(productPublicPath(product));

    try {
      await navigator.clipboard.writeText(url);
      setMessage("リンクをコピーしました");
    } catch {
      setMessage("コピーに失敗しました");
    }

    window.setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="secondary" onClick={copyLink}>
        共有リンクをコピー
      </Button>
      {message && <span className="text-sm text-green-600 dark:text-green-400">{message}</span>}
    </div>
  );
}
