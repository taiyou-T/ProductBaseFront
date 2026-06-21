"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { APPROVAL_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/types";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = use(params);
  const router = useRouter();
  const { token } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (!token || !productId) return;
    api<{ data: Product }>(`/creator/products/${productId}`, {}, token)
      .then((res) => {
        setProduct(res.data);
        reset({
          title: res.data.title,
          catch_copy: res.data.catch_copy ?? "",
          description: res.data.description ?? "",
          service_url: res.data.service_url ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [token, productId, reset]);

  const onSubmit = async (data: Record<string, string>) => {
    if (!token || !productId) return;
    setError(null);
    setMessage(null);
    try {
      await api(`/creator/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }, token);
      setMessage("保存しました");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "保存に失敗しました");
    }
  };

  const submitForReview = async () => {
    if (!token || !productId) return;
    setError(null);
    try {
      await api(`/creator/products/${productId}/submit`, { method: "POST" }, token);
      setMessage("掲載申請を送信しました");
      const res = await api<{ data: Product }>(`/creator/products/${productId}`, {}, token);
      setProduct(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "申請に失敗しました");
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!product) return <p>成果物が見つかりません。</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">成果物を編集</h1>
        {product.approval_status && (
          <Badge>{APPROVAL_STATUS_LABELS[product.approval_status]}</Badge>
        )}
      </div>
      {product.rejection_reason && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30">
          却下理由: {product.rejection_reason}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="タイトル" {...register("title")} />
        <Input label="キャッチコピー" {...register("catch_copy")} />
        <Textarea label="説明" rows={5} {...register("description")} />
        <Input label="サービス URL" {...register("service_url")} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
          {(product.approval_status === "draft" || product.approval_status === "rejected") && (
            <Button type="button" variant="secondary" onClick={submitForReview}>
              掲載申請する
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/products")}>
            一覧へ
          </Button>
        </div>
      </form>
    </div>
  );
}
