"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategorySelect } from "@/components/products/CategorySelect";
import type { Product } from "@/types";

const schema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  catch_copy: z.string().optional(),
  description: z.string().optional(),
  service_url: z.string().url().optional().or(z.literal("")),
  category_id: z.string().optional(),
  development_status: z.enum([
    "planning", "developing", "testing", "beta", "released", "ended",
  ]),
  thumbnail_url: z.string().optional(),
});

export default function NewProductPage() {
  const router = useRouter();
  const { token, user, refreshUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [checkingCreator, setCheckingCreator] = useState(true);

  useEffect(() => {
    if (!token) return;
    refreshUser()
      .catch(() => undefined)
      .finally(() => setCheckingCreator(false));
  }, [token, refreshUser]);

  const { register, handleSubmit, setValue, watch, control, formState: { isSubmitting } } = useForm({
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
        category_id: data.category_id ? Number(data.category_id) : undefined,
      };
      const res = await api<{ product: Product }>("/creator/products", {
        method: "POST",
        body: JSON.stringify(body),
      }, token);
      router.push(`/dashboard/products/${res.product.id}/edit`);
    } catch (e) {
      setError(getApiErrorMessage(e, "作成に失敗しました"));
    }
  };

  if (checkingCreator) {
    return <p className="text-zinc-500">読み込み中...</p>;
  }

  if (!user?.is_creator) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
        <h1 className="text-xl font-bold">掲載者プロフィールが必要です</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          成果物を作成する前に、掲載者としてのプロフィール登録が必要です。
        </p>
        <Button type="button" onClick={() => router.push("/dashboard/onboarding")}>
          プロフィールを作成する
        </Button>
        <p className="text-sm">
          <Link href="/dashboard" className="text-indigo-600 hover:underline">ダッシュボードに戻る</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">成果物を作成</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="タイトル" {...register("title")} />
        <Input label="キャッチコピー" {...register("catch_copy")} />
        <Textarea label="説明" rows={10} {...register("description")} />
        <Input label="サービス URL" type="url" placeholder="https://..." {...register("service_url")} />
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <CategorySelect
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
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
