"use client";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthRedirect();

  if (!isAuthenticated) {
    return <p className="text-zinc-500">読み込み中...</p>;
  }

  return <>{children}</>;
}
