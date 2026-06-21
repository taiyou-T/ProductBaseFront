import type { User } from "@/types";
import { canAccessChat } from "@/lib/chat-access";

export type SiteNavLink = {
  href: string;
  label: string;
};

export type SiteNavGroup = {
  title: string;
  links: SiteNavLink[];
};

export function getBottomTabLinks(user: User | null): SiteNavLink[] {
  if (user) {
    return [
      { href: "/", label: "ホーム" },
      { href: "/products", label: "成果物" },
      { href: "/search", label: "検索" },
      { href: "/favorites", label: "お気に入り" },
    ];
  }

  return [
    { href: "/", label: "ホーム" },
    { href: "/products", label: "成果物" },
    { href: "/search", label: "検索" },
    { href: "/login", label: "ログイン" },
  ];
}

export function getDesktopNavLinks(user: User | null): SiteNavLink[] {
  const links: SiteNavLink[] = [
    { href: "/products", label: "成果物" },
    { href: "/search", label: "検索" },
  ];

  if (!user) {
    return links;
  }

  links.push(
    { href: "/favorites", label: "お気に入り" },
    { href: "/creator-favorites", label: "開発者" },
    { href: "/notifications", label: "通知" },
  );

  if (user.is_supporter) {
    links.push({ href: "/view-history", label: "履歴" });
  }

  if (canAccessChat(user)) {
    links.push({ href: "/conversations", label: "チャット" });
  }

  links.push(
    { href: "/dashboard", label: "ダッシュボード" },
    { href: "/settings/billing", label: "プラン" },
  );

  return links;
}

export function getMobileMenuGroups(user: User | null): SiteNavGroup[] {
  const groups: SiteNavGroup[] = [
    {
      title: "探す",
      links: [
        { href: "/products", label: "成果物一覧" },
        { href: "/search", label: "検索" },
      ],
    },
  ];

  if (!user) {
    groups.push({
      title: "アカウント",
      links: [
        { href: "/login", label: "ログイン" },
        { href: "/register", label: "新規登録" },
      ],
    });

    return groups;
  }

  const myLinks: SiteNavLink[] = [
    { href: "/favorites", label: "お気に入り" },
    { href: "/creator-favorites", label: "フォロー中の開発者" },
    { href: "/notifications", label: "通知" },
  ];

  if (user.is_supporter) {
    myLinks.push({ href: "/view-history", label: "閲覧履歴" });
  }

  if (canAccessChat(user)) {
    myLinks.push({ href: "/conversations", label: "チャット" });
  }

  groups.push({ title: "マイページ", links: myLinks });

  groups.push({
    title: "掲載者",
    links: [{ href: "/dashboard", label: "ダッシュボード" }],
  });

  groups.push({
    title: "設定",
    links: [{ href: "/settings/billing", label: "プラン・お支払い" }],
  });

  return groups;
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
