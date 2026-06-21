"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getMobileMenuGroups, isNavLinkActive } from "@/lib/site-nav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { IconClose } from "@/components/layout/NavIcons";
import type { User } from "@/types";

export function MobileMenu({
  open,
  onClose,
  user,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const groups = getMobileMenuGroups(user);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="メニューを閉じる"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-xl dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <p className="font-semibold">メニュー</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="閉じる"
          >
            <IconClose />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {user && (
            <p className="mb-4 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              {user.name}
            </p>
          )}

          {groups.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.links.map((link) => {
                  const active = isNavLinkActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block rounded-lg px-3 py-2.5 text-sm ${
                          active
                            ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="mb-6">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              表示
            </p>
            <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">テーマ</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {user && (
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <Button variant="ghost" onClick={onLogout} className="w-full justify-center">
              ログアウト
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
