"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  catch_copy: z.string().optional(),
  description: z.string().optional(),
  service_url: z.string().url().optional().or(z.literal("")),
  category_id: z.coerce.number().optional(),
  development_status: z.enum([
    "planning", "developing", "testing", "beta", "released", "ended",
  ]),
  thumbnail_url: z.string().optional(),
});

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { development_status: "planning" },
  });

  const thumbnailUrl = watch("thumbnail_url");

  const uploadImage = async (file: File) => {
    if (!token) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await api<{ url: string }>("/uploads/image", {
        method: "POST",
        body: form,
      }, token);
      setValue("thumbnail_url", res.url);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!token) return;
    setError(null);
    try {
      const body = {
        ...data,
        service_url: data.service_url || undefined,
        category_id: data.category_id || undefined,
      };
      const res = await api<{ product: { data: { id: number } } }>("/creator/products", {
        method: "POST",
        body: JSON.stringify(body),
      }, token);
      router.push(`/dashboard/products/${res.product.data.id}/edit`);
    } catch (e) {
      setError(getApiErrorMessage(e, "作成に失敗しました"));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">成果物を作成</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="タイトル" {...register("title")} />
        <Input label="キャッチコピー" {...register("catch_copy")} />
        <Textarea label="説明" rows={5} {...register("description")} />
        <Input label="サービス URL" type="url" placeholder="https://..." {...register("service_url")} />
        <div>
          <label className="block text-sm font-medium">サムネイル</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 text-sm"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
            disabled={uploading}
          />
          {thumbnailUrl && (
            <p className="mt-1 text-xs text-green-600">アップロード済み</p>
          )}
          <input type="hidden" {...register("thumbnail_url")} />
        </div>
        <div>
          <label className="block text-sm font-medium">開発ステータス</label>
          <select
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            {...register("development_status")}
          >
            <option value="planning">企画中</option>
            <option value="developing">開発中</option>
            <option value="testing">テスト中</option>
            <option value="beta">ベータ</option>
            <option value="released">リリース済み</option>
            <option value="ended">終了</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "作成中..." : "下書きとして保存"}
        </Button>
      </form>
    </div>
  );
}
