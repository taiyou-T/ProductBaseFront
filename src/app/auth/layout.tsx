import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("認証");

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
