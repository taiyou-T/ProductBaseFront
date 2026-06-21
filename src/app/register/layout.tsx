import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("新規登録");

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
