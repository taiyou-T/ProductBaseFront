"use client";

import { useEffect } from "react";
import { useSiteConfigStore } from "@/lib/site-config-store";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { MaintenancePage } from "@/components/site/MaintenancePage";
import { TermsAgreementModal } from "@/components/site/TermsAgreementModal";

export function SiteGate({ children }: { children: React.ReactNode }) {
  const { config, loaded, load } = useSiteConfigStore();
  const { token, user, hydrated, refreshUser, clearAuth } = useAuthStore();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (hydrated && token) {
      refreshUser().catch(() => {});
    }
  }, [hydrated, token, refreshUser]);

  if (!loaded) {
    return <p className="text-center text-zinc-500 py-12">読み込み中...</p>;
  }

  if (config?.maintenance_mode) {
    return <MaintenancePage message={config.maintenance_message} />;
  }

  const handleLogout = async () => {
    try {
      if (token) await api("/auth/logout", { method: "POST" }, token);
    } finally {
      clearAuth();
    }
  };

  return (
    <>
      {children}
      {hydrated && user?.needs_terms_agreement && config?.terms_content && (
        <TermsAgreementModal
          termsContent={config.terms_content}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
