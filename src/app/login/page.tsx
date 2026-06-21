"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { AuthResponse } from "@/types";

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setError(null);
    try {
      const res = await api<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
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

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="メールアドレス" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="パスワード" type="password" error={errors.password?.message} {...register("password")} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </Button>
      </form>
      <p className="text-sm text-zinc-500">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="text-indigo-600 hover:underline">登録</Link>
      </p>
    </div>
  );
}
