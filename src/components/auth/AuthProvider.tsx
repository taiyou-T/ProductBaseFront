"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    useAuthStore.persist.onFinishHydration(() => setHydrated());
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated();
    }
  }, [setHydrated]);

  return <>{children}</>;
}
