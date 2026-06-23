"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CreatorProfile } from "@/types";

const schema = z.object({
  display_name: z.string().min(1, "表示名を入力してください"),
  bio: z.string().optional(),
  website_url: z.string().optional(),
  github_url: z.string().optional(),
  chat_status: z.enum(["closed", "supporter_only", "open"]),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { token, user, refreshUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: "",
      bio: "",
      website_url: "",
      github_url: "",
      chat_status: "closed",
    },
  });

  useEffect(() => {
    if (!token) return;
    refreshUser().catch(() => undefined);
  }, [token, refreshUser]);

  useEffect(() => {
    if (!token) return;

    if (!user?.is_creator) {
      setHasProfile(false);
      reset({
        display_name: user?.name ?? "",
        bio: "",
        website_url: "",
        github_url: "",
        chat_status: "closed",
      });
      return;
    }

    api<{ data: CreatorProfile }>("/creator/profile", {}, token)
      .then((res) => {
        setHasProfile(true);
        reset({
          display_name: res.data.display_name,
          bio: res.data.bio ?? "",
          website_url: res.data.website_url ?? "",
          github_url: res.data.github_url ?? "",
          chat_status: res.data.chat_status ?? "closed",
        });
      })
      .catch(() => {
        setHasProfile(false);
        reset({
          display_name: user?.name ?? "",
          bio: "",
          website_url: "",
          github_url: "",
          chat_status: "closed",
        });
      });
  }, [token, user?.is_creator, user?.name, reset]);

  const onSubmit = async (data: FormData) => {
    if (!token) return;
    setError(null);
    setMessage(null);

    const payload = {
      ...data,
      bio: data.bio || null,
      website_url: data.website_url || null,
      github_url: data.github_url || null,
    };

    try {
      if (hasProfile) {
        await api("/creator/profile", {
          method: "PUT",
          body: JSON.stringify(payload),
        }, token);
        setMessage("プロフィールを更新しました");
      } else {
        await api("/creator/profile", {
          method: "POST",
          body: JSON.stringify(payload),
        }, token);
        setHasProfile(true);
        setMessage("掲載者プロフィールを作成しました");
      }
      await refreshUser();
    } catch (e) {
      setError(getApiErrorMessage(e, "保存に失敗しました"));
    }
  };

  const isCreate = hasProfile === false;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">
        {isCreate ? "掲載者プロフィール作成" : "プロフィール編集"}
      </h1>
      {isCreate && (
        <p className="text-sm text-zinc-500">
          表示名などを入力して保存すると、掲載者プロフィールが作成されます。
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="表示名"
          error={errors.display_name?.message}
          {...register("display_name")}
        />
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
        <Button type="submit" disabled={isSubmitting || hasProfile === null}>
          {isSubmitting ? "保存中..." : isCreate ? "作成して保存" : "保存"}
        </Button>
      </form>
    </div>
  );
}
