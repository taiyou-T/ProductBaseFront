"use client";

import { create } from "zustand";
import type { SiteConfig } from "@/types/site";
import { api } from "@/lib/api";
import { createDefaultSiteConfig } from "@/lib/site-config-defaults";

interface SiteConfigState {
  config: SiteConfig | null;
  loaded: boolean;
  load: () => Promise<void>;
}

export const useSiteConfigStore = create<SiteConfigState>((set) => ({
  config: null,
  loaded: false,
  load: async () => {
    try {
      const config = await api<SiteConfig>("/public/site-config");
      set({ config, loaded: true });
    } catch {
      set({ config: createDefaultSiteConfig(), loaded: true });
    }
  },
}));
