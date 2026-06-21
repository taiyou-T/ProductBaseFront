"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBottomTabLinks, isNavLinkActive } from "@/lib/site-nav";
import { getTabIcon, IconMenu } from "@/components/layout/NavIcons";
import type { User } from "@/types";

export function BottomTabBar({
  user,
  onMenuOpen,
  menuOpen,
}: {
  user: User | null;
  onMenuOpen: () => void;
  menuOpen: boolean;
}) {
  const pathname = usePathname();
  const tabs = getBottomTabLinks(user);

  const menuActive =
    menuOpen ||
    ["/dashboard", "/creator-favorites", "/notifications", "/conversations", "/view-history", "/settings"].some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
      aria-label="メインナビゲーション"
    >
      <div className="mx-auto flex max-w-6xl items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const Icon = getTabIcon(tab.href);
          const active = isNavLinkActive(pathname, tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] ${
                active
                  ? "font-medium text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onMenuOpen}
          className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] ${
            menuActive
              ? "font-medium text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
          aria-label="メニューを開く"
          aria-expanded={menuOpen}
        >
          <IconMenu className="h-5 w-5 shrink-0" />
          <span className="truncate">メニュー</span>
        </button>
      </div>
    </nav>
  );
}
