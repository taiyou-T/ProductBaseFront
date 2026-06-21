"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { SiteNavLink } from "@/lib/site-nav";
import type { User } from "@/types";
import type { ReactNode } from "react";

export function Header({
  desktopLinks,
  user,
  onLogout,
  mobileActions,
  guestActions,
}: {
  desktopLinks: SiteNavLink[];
  user: User | null;
  onLogout: () => void;
  mobileActions?: ReactNode;
  guestActions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link href="/" className="shrink-0 text-lg font-bold text-indigo-600">
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-3 text-sm md:flex">
          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          {guestActions}
          {user && (
            <Button variant="ghost" onClick={onLogout} className="!px-2 !py-1">
              ログアウト
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">{mobileActions}</div>
      </div>
    </header>
  );
}
