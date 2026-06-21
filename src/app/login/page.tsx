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
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { config, load } = useSiteConfigStore();
  const [error, setError] = useState<string | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const termsRequired = config?.terms_required ?? false;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (termsRequired && !termsAgreed) return;
    setError(null);
    try {
      const res = await api<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          terms_agreed: termsRequired ? true : undefined,
        }),
      });
      setAuth(res.token, res.user);
      router.push("/dashboard");
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("ログインに失敗しました");
      }
    }
  };

  const canSubmit = !isSubmitting && (!termsRequired || termsAgreed);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="メールアドレス" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="パスワード" type="password" error={errors.password?.message} {...register("password")} />
        {termsRequired && (
          <TermsCheckbox checked={termsAgreed} onChange={setTermsAgreed} />
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={!canSubmit} className="w-full">
          {isSubmitting ? "ログイン中..." : "ログイン"}
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
      <GoogleLoginButton termsRequired={termsRequired} termsAgreed={termsAgreed} />
      <p className="text-sm text-zinc-500">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="text-indigo-600 hover:underline">登録</Link>
      </p>
    </div>
  );
}
