import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-500">
        <p>{SITE_NAME} — 個人開発者の成果物を発信するプラットフォーム</p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            利用規約
          </Link>
          <Link href="/contact" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            お問い合わせ
          </Link>
        </p>
        <p className="mt-2">© {year} {SITE_NAME}</p>
      </div>
    </footer>
  );
}
