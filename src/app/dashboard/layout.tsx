import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import { DashboardShell } from "./DashboardShell";

export const metadata: Metadata = noIndexMetadata("ダッシュボード");

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
