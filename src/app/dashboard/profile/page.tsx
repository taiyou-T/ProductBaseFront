"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CreatorProfile } from "@/types";

export default function ProfilePage() {
  const { token, refreshUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (!token) return;
    api<{ data: CreatorProfile }>("/creator/profile", {}, token)
      .then((res) => {
        reset({
          display_name: res.data.display_name,
          bio: res.data.bio ?? "",
          website_url: res.data.website_url ?? "",
          github_url: res.data.github_url ?? "",
          chat_status: res.data.chat_status ?? "closed",
        });
      })
      .catch(() => {});
  }, [token, reset]);

  const onSubmit = async (data: Record<string, string>) => {
    if (!token) return;
    setError(null);
    setMessage(null);
    try {
      await api("/creator/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }, token);
      await refreshUser();
      setMessage("プロフィールを更新しました");
    } catch (e) {
      setError(getApiErrorMessage(e, "更新に失敗しました"));
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">プロフィール編集</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="表示名" {...register("display_name")} />
        <Textarea label="自己紹介" rows={4} {...register("bio")} />
        <Input label="Website" {...register("website_url")} />
        <Input label="GitHub" {...register("github_url")} />
        <div>
          <label htmlFor="chat_status" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            チャット受付
          </label>
          <select
            id="chat_status"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            {...register("chat_status")}
          >
            <option value="closed">受付停止</option>
            <option value="supporter_only">サポーター限定（推奨）</option>
            <option value="open">誰でも開始可</option>
          </select>
          <p className="mt-1 text-xs text-zinc-500">
            「受付停止」のままでは開発者ページにチャット開始ボタンが表示されません。
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
      </form>
    </div>
  );
}
