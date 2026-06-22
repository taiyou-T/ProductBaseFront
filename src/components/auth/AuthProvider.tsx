"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    const onHydrated = () => {
      setHydrated();
      const { token, refreshUser } = useAuthStore.getState();
      if (token) {
        refreshUser().catch(() => undefined);
      }
    };

    useAuthStore.persist.onFinishHydration(onHydrated);
    if (useAuthStore.persist.hasHydrated()) {
      onHydrated();
    }
  }, [setHydrated]);

  return <>{children}</>;
}
