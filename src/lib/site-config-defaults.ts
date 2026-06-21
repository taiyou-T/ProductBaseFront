import type { SiteConfig } from "@/types/site";

export function createDefaultSiteConfig(): SiteConfig {
  return {
    maintenance_mode: false,
    maintenance_message: "",
    terms_version: 1,
    terms_content: "",
    terms_required: false,
  };
}
