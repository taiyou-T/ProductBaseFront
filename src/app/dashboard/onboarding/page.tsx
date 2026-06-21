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
import type { CreatorProfile } from "@/types";

const schema = z.object({
  display_name: z.string().min(1, "表示名を入力してください"),
  slug: z.string().optional(),
  bio: z.string().optional(),
});

export default function OnboardingPage() {
  const router = useRouter();
  const { token, setAuth, user, refreshUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { display_name: user?.name ?? "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!token) return;
    setError(null);
    try {
      await api<{ profile: { data: CreatorProfile } }>("/creator/profile", {
        method: "POST",
        body: JSON.stringify(data),
      }, token);
      await refreshUser();
      router.push("/dashboard/products/new");
    } catch (e) {
      setError(getApiErrorMessage(e, "作成に失敗しました"));
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">掲載者プロフィール作成</h1>
      <p className="text-sm text-zinc-500">
        成果物を掲載する前に、開発者としてのプロフィールを作成します。
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="表示名" {...register("display_name")} />
        <Input label="スラッグ（任意）" placeholder="my-name" {...register("slug")} />
        <Textarea label="自己紹介" rows={4} {...register("bio")} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          作成して成果物登録へ
        </Button>
      </form>
    </div>
  );
}
