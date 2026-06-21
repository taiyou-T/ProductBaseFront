import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("お支払い");

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
