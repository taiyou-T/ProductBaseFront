"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

export function useLogout() {
  const router = useRouter();
  const { token, clearAuth } = useAuthStore();

  return useCallback(async () => {
    try {
      if (token) {
        await api("/auth/logout", { method: "POST" }, token);
      }
    } finally {
      clearAuth();
      router.replace("/");
    }
  }, [token, clearAuth, router]);
}
