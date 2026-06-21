"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/auth-store";
import { api, ApiError } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Organization } from "@/types";

const schema = z.object({
  name: z.string().min(1, "団体名を入力してください"),
  slug: z.string().optional(),
  description: z.string().optional(),
  website_url: z.string().url("有効な URL を入力").optional().or(z.literal("")),
  github_url: z.string().url("有効な URL を入力").optional().or(z.literal("")),
  x_url: z.string().url("有効な URL を入力").optional().or(z.literal("")),
});

export default function NewOrganizationPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!token) return;
    setError(null);
    try {
      const res = await api<{ organization: Organization }>(
        "/creator/organizations",
        {
          method: "POST",
          body: JSON.stringify({
            ...data,
            website_url: data.website_url || undefined,
            github_url: data.github_url || undefined,
            x_url: data.x_url || undefined,
          }),
        },
        token,
      );
      router.push(`/dashboard/organizations/${res.organization.id}/edit`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "作成に失敗しました");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/dashboard/organizations" className="text-sm text-indigo-600 hover:underline">
        ← 団体一覧
      </Link>
      <h1 className="text-2xl font-bold">団体を作成</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="団体名" error={errors.name?.message} {...register("name")} />
        <Input label="スラッグ（任意）" error={errors.slug?.message} {...register("slug")} />
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            説明
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <Input label="Website" error={errors.website_url?.message} {...register("website_url")} />
        <Input label="GitHub" error={errors.github_url?.message} {...register("github_url")} />
        <Input label="X" error={errors.x_url?.message} {...register("x_url")} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "作成中..." : "作成"}
        </Button>
      </form>
    </div>
  );
}
