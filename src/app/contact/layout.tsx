import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "お問い合わせ",
  description:
    "ProductBase へのお問い合わせ窓口。アカウント、掲載、機能改善などに関するご連絡を受け付けています。",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
