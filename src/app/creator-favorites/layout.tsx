import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("フォロー中の開発者");

export default function CreatorFavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
