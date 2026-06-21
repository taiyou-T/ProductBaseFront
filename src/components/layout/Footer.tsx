import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-500">
        <p>{SITE_NAME} — 個人開発者の成果物を発信するプラットフォーム</p>
      </div>
    </footer>
  );
}
