import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("お気に入り");

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
