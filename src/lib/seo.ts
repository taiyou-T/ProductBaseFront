import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";

export const NO_INDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

export const PUBLIC_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export function noIndexMetadata(title?: string): Metadata {
  return {
    ...(title ? { title } : {}),
    robots: NO_INDEX_ROBOTS,
  };
}

/** トップ・一覧ページ向けの広いキーワードセット */
export const SITE_KEYWORDS = [
  "個人開発 サービス 公開",
  "個人開発 宣伝 方法",
  "Product Hunt 日本語版",
  "個人開発 ポートフォリオ 掲載",
  "アプリ リリース 告知 サイト",
  "スタートアップ 紹介 プラットフォーム",
  "便利なWebサービス おすすめ",
  "無料アプリ おすすめ",
  "日本製アプリ 一覧",
  "個人開発アプリ おすすめ",
  "AIツール 個人開発 日本",
  "Chrome拡張機能 おすすめ",
  "個人開発者 スカウト",
  "個人開発アプリ",
] as const;

export function siteKeywords(...extra: string[]): string[] {
  const merged = [...SITE_KEYWORDS, ...extra];
  return [...new Set(merged.map((keyword) => keyword.trim()).filter(Boolean))];
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function resolveOgImage(image?: string | null): string {
  if (!image) {
    return absoluteUrl("/favicon.ico");
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return absoluteUrl(image);
  }

  return image;
}

export const DEFAULT_SITE_DESCRIPTION =
  "個人開発アプリ・スタートアップの成果物を掲載・公開し、SEOで宣伝できるポートフォリオプラットフォーム。日本製アプリの発見やアプリリリース告知に。";

const META_DESCRIPTION_MAX = 160;

export function buildMetaDescription(...parts: Array<string | null | undefined>): string {
  const text = parts
    .map((part) => part?.replace(/\s+/g, " ").trim())
    .filter((part): part is string => Boolean(part))
    .join(" ");

  if (!text) {
    return DEFAULT_SITE_DESCRIPTION;
  }

  if (text.length <= META_DESCRIPTION_MAX) {
    return text;
  }

  return `${text.slice(0, META_DESCRIPTION_MAX - 1)}…`;
}

export function buildProductDescription(product: {
  title: string;
  catch_copy?: string | null;
  description?: string | null;
  category?: { name: string } | null;
}): string {
  const categoryHint = product.category ? `${product.category.name}の個人開発アプリ` : null;
  const summary = buildMetaDescription(product.catch_copy, product.description, categoryHint);

  if (summary === DEFAULT_SITE_DESCRIPTION) {
    return buildMetaDescription(`${product.title} - ProductBaseで公開中の成果物`);
  }

  return summary;
}

export function buildProductKeywords(product: {
  title: string;
  category?: { name: string } | null;
  tags?: { name: string }[];
}): string[] {
  return [
    ...new Set(
      [
        product.title,
        product.category?.name,
        "個人開発アプリ",
        ...(product.tags?.map((tag) => tag.name) ?? []),
      ]
        .map((keyword) => keyword?.trim())
        .filter((keyword): keyword is string => Boolean(keyword)),
    ),
  ];
}

export function publicPageMetadata({
  title,
  description,
  path,
  image,
  keywords,
  useSiteKeywords = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
  /** トップ・一覧ページのみ true（詳細ページは固有キーワードを優先） */
  useSiteKeywords?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = resolveOgImage(image);
  const resolvedKeywords = useSiteKeywords
    ? siteKeywords(...(keywords ?? []))
    : keywords && keywords.length > 0
      ? [...new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean))]
      : undefined;

  return {
    title,
    description,
    ...(resolvedKeywords ? { keywords: resolvedKeywords } : {}),
    robots: PUBLIC_ROBOTS,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "ja_JP",
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
