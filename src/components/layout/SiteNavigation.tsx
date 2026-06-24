"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { useLogout } from "@/hooks/use-logout";
import { getDesktopNavLinks } from "@/lib/site-nav";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { IconMenu } from "@/components/layout/NavIcons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";

export function SiteNavigation() {
  const { user, token, hydrated } = useAuthStore();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleLogout = useCallback(async () => {
    setMenuOpen(false);
    await logout();
  }, [logout]);

  const desktopLinks = getDesktopNavLinks(hydrated && token ? user : null);

  return (
    <>
      <Header
        desktopLinks={desktopLinks}
        user={hydrated && token ? user : null}
        onLogout={handleLogout}
        mobileActions={
          <>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="メニューを開く"
            >
              <IconMenu />
            </button>
          </>
        }
        guestActions={
          hydrated && !token ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400">
                ログイン
              </Link>
              <ButtonLink href="/register">登録</ButtonLink>
            </div>
          ) : null
        }
      />

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        user={hydrated && token ? user : null}
        onLogout={handleLogout}
      />

      <BottomTabBar
        user={hydrated && token ? user : null}
        onMenuOpen={() => setMenuOpen(true)}
        menuOpen={menuOpen}
      />
    </>
  );
}
