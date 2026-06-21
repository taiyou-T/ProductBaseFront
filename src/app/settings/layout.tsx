import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("設定");

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
