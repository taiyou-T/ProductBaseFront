"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { loginUrlWithNext } from "@/lib/auth-session";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && !token) {
      router.replace(loginUrlWithNext(pathname));
    }
  }, [hydrated, token, router, pathname]);

  return {
    token,
    hydrated,
    isAuthenticated: hydrated && !!token,
  };
}
