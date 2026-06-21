"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import type { User } from "@/types";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        const data = await api<{ data: User }>("/auth/me", {}, token);
        setAuth(token, data.data);
        router.replace("/dashboard");
      } catch {
        router.replace("/login");
      }
    })();
  }, [searchParams, router, setAuth]);

  return <p className="text-center text-zinc-500">認証処理中...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="text-center">読み込み中...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}
