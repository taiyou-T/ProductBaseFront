"use client";

import { useEffect } from "react";
import { useSiteConfigStore } from "@/lib/site-config-store";
import { useAuthStore } from "@/lib/auth-store";
import { useLogout } from "@/hooks/use-logout";
import { MaintenancePage } from "@/components/site/MaintenancePage";
import { TermsAgreementModal } from "@/components/site/TermsAgreementModal";

export function SiteGate({ children }: { children: React.ReactNode }) {
  const { config, loaded, load } = useSiteConfigStore();
  const { token, user, hydrated, refreshUser } = useAuthStore();
  const logout = useLogout();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (hydrated && token) {
      refreshUser().catch(() => {});
    }
  }, [hydrated, token, refreshUser]);

  if (!loaded) {
    return <>{children}</>;
  }

  if (config?.maintenance_mode) {
    return <MaintenancePage message={config.maintenance_message} />;
  }

  return (
    <>
      {children}
      {hydrated && user?.needs_terms_agreement && config?.terms_content && (
        <TermsAgreementModal
          termsContent={config.terms_content}
          onLogout={logout}
        />
      )}
    </>
  );
}
