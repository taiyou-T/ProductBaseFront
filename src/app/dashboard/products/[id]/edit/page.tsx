"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategorySelect } from "@/components/products/CategorySelect";
import { APPROVAL_STATUS_LABELS, DEVELOPMENT_STATUS_LABELS, IMAGE_UPLOAD_MAX_LABEL } from "@/lib/constants";
import { validateImageFileSize } from "@/lib/image-upload";
import { canSubmitListing, formatListingSubmissionUsage } from "@/lib/creator-plan";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/types";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, refreshUser } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, control, formState: { isSubmitting } } = useForm();
  const thumbnailUrl = watch("thumbnail_url");

  useEffect(() => {
    if (!token) return;
    refreshUser().catch(() => undefined);
  }, [token, refreshUser]);

  useEffect(() => {
    if (searchParams.get("notice") === "submitted") {
      setMessage("掲載申請を送信しました");
      router.replace(`/dashboard/products/${productId}/edit`);
    }
  }, [searchParams, productId, router]);

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
          thumbnail_url: res.data.thumbnail_url ?? "",
          category_id: res.data.category?.id != null ? String(res.data.category.id) : "",
          development_status: res.data.development_status,
        });
      })
      .finally(() => setLoading(false));
  }, [token, productId, reset]);

  const uploadImage = async (file: File) => {
    if (!token) return;
    const sizeError = validateImageFileSize(file);
    if (sizeError) {
      setError(sizeError);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await api<{ url: string }>("/uploads/image", {
        method: "POST",
        body: form,
      }, token);
      setValue("thumbnail_url", res.url);
      setMessage("サムネイルをアップロードしました。保存ボタンで反映してください。");
    } catch (e) {
      setError(getApiErrorMessage(e, "画像のアップロードに失敗しました"));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: Record<string, string>) => {
    if (!token || !productId) return;
    setError(null);
    setMessage(null);
    try {
      const body = {
        ...data,
        service_url: data.service_url || undefined,
        thumbnail_url: data.thumbnail_url || undefined,
        category_id: data.category_id ? Number(data.category_id) : null,
      };
      await api(`/creator/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }, token);
      setMessage("保存しました");
    } catch (e) {
      setError(getApiErrorMessage(e, "保存に失敗しました"));
    }
  };

  const submitForReview = async () => {
    if (!token || !productId) return;
    setError(null);
    try {
      await api(`/creator/products/${productId}/submit`, { method: "POST" }, token);
      setMessage("掲載申請を送信しました");
      await refreshUser();
      const res = await api<{ data: Product }>(`/creator/products/${productId}`, {}, token);
      setProduct(res.data);
    } catch (e) {
      setError(getApiErrorMessage(e, "申請に失敗しました"));
    }
  };

  const deleteProduct = async () => {
    if (!token || !productId || !product) return;
    const isDraft = product.approval_status === "draft";
    const confirmMessage = isDraft
      ? "この下書きを削除します。元に戻せません。"
      : "この成果物をアーカイブします。公開ページは非表示になります。";
    if (!window.confirm(confirmMessage)) return;

    setDeleting(true);
    setError(null);
    setMessage(null);
    try {
      await api(`/creator/products/${productId}`, { method: "DELETE" }, token);
      router.push("/dashboard/products");
    } catch (e) {
      setError(getApiErrorMessage(e, isDraft ? "削除に失敗しました" : "アーカイブに失敗しました"));
      setDeleting(false);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!product) return <p>成果物が見つかりません。</p>;

  const canList = user?.creator_profile?.can_list ?? true;
  const profile = user?.creator_profile;
  const canSubmit =
    canSubmitListing(profile, product.approval_status);
  const atSubmissionLimit =
    profile &&
    product.approval_status === "draft" &&
    !canSubmit &&
    canList;

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
      {!canList && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-medium">無料トライアル期間が終了しています</p>
          <p className="mt-1 text-amber-800 dark:text-amber-200">
            掲載申請・公開表示には基本掲載プラン（または Premium）の契約が必要です。
            既に公開されていた成果物も一覧には表示されません。
          </p>
          <Link
            href="/settings/billing"
            className="mt-2 inline-block text-indigo-600 hover:underline dark:text-indigo-400"
          >
            プラン・課金設定へ
          </Link>
        </div>
      )}
      {atSubmissionLimit && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30">
          <p className="font-medium">掲載申請の上限に達しています</p>
          <p className="mt-1 text-amber-800 dark:text-amber-200">
            現在 {formatListingSubmissionUsage(profile)} です。新しい成果物を申請するには、既存成果物をアーカイブするか Premium プランへ変更してください。
          </p>
          <Link
            href="/settings/billing"
            className="mt-2 inline-block text-indigo-600 hover:underline dark:text-indigo-400"
          >
            プラン・課金設定へ
          </Link>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="タイトル" {...register("title")} />
        <Input label="キャッチコピー" {...register("catch_copy")} />
        <Textarea label="説明" rows={10} {...register("description")} />
        <Input label="サービス URL" {...register("service_url")} />
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
          <label className="block text-sm font-medium">開発ステータス</label>
          <select
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            {...register("development_status")}
          >
            {Object.entries(DEVELOPMENT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">サムネイル</label>
          <p className="mt-0.5 text-xs text-zinc-500">
            JPEG・PNG・GIF・WebP形式、{IMAGE_UPLOAD_MAX_LABEL}以下
          </p>
          {thumbnailUrl && (
            <div className="relative mt-2 h-40 w-full max-w-xs overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
              <Image
                src={thumbnailUrl}
                alt="サムネイルプレビュー"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="mt-2 text-sm"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
            disabled={uploading}
          />
          {uploading && <p className="mt-1 text-xs text-zinc-500">アップロード中...</p>}
          <input type="hidden" {...register("thumbnail_url")} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
          {canSubmit && (
            <Button type="button" variant="secondary" onClick={submitForReview}>
              掲載申請する
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/products")}>
            一覧へ
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={deleting}
            onClick={deleteProduct}
          >
            {deleting
              ? "処理中..."
              : product.approval_status === "draft"
                ? "下書きを削除"
                : "アーカイブ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
