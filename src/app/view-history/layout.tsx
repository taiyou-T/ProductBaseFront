import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("閲覧履歴");

export default function ViewHistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
