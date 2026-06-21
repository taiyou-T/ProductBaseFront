"use client";

import { create } from "zustand";
import type { SiteConfig } from "@/types/site";
import { api } from "@/lib/api";

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
      set({
        config: {
          maintenance_mode: false,
          maintenance_message: "",
          terms_version: 1,
          terms_content: "",
          terms_required: false,
        },
        loaded: true,
      });
    }
  },
}));
