import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("チャット");

export default function ConversationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
