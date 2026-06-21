"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { useSiteConfigStore } from "@/lib/site-config-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TermsCheckbox } from "@/components/auth/TermsCheckbox";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import type { AuthResponse } from "@/types";

const schema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上"),
  as_creator: z.boolean(),
  display_name: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { load } = useSiteConfigStore();
  const [error, setError] = useState<string | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { as_creator: true },
  });

  const asCreator = watch("as_creator");

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!termsAgreed) return;
    setError(null);
    try {
      const res = await api<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          terms_agreed: true,
        }),
      });
      setAuth(res.token, res.user);
      router.push(data.as_creator ? "/dashboard/onboarding" : "/dashboard");
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("登録に失敗しました");
      }
    }
  };

  const canSubmit = !isSubmitting && termsAgreed;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">新規登録</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="名前" error={errors.name?.message} {...register("name")} />
        <Input label="メールアドレス" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="パスワード" type="password" error={errors.password?.message} {...register("password")} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("as_creator")} />
          掲載者として登録する
        </label>
        {asCreator && (
          <Input label="表示名（掲載者名）" error={errors.display_name?.message} {...register("display_name")} />
        )}
        <TermsCheckbox checked={termsAgreed} onChange={setTermsAgreed} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={!canSubmit} className="w-full">
          {isSubmitting ? "登録中..." : "登録"}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-50 px-2 text-zinc-500 dark:bg-zinc-950">または</span>
        </div>
      </div>
      <GoogleLoginButton termsRequired={true} termsAgreed={termsAgreed} />
      <p className="text-sm text-zinc-500">
        既にアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">ログイン</Link>
      </p>
    </div>
  );
}
