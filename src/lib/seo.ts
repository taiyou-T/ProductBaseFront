import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";

export const NO_INDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

export function noIndexMetadata(title?: string): Metadata {
  return {
    ...(title ? { title } : {}),
    robots: NO_INDEX_ROBOTS,
  };
}

/** サイト全体の meta keywords（公開ページ共通） */
export const SITE_KEYWORDS = [
  "個人開発 サービス 公開",
  "個人開発 宣伝 方法",
  "Product Hunt 日本語版",
  "個人開発 ポートフォリオ 掲載",
  "アプリ リリース 告知 サイト",
  "スタートアップ 紹介 プラットフォーム",
  "便利なWebサービス おすすめ",
  "無料アプリ おすすめ 2025",
  "無料アプリ おすすめ 2026",
  "日本製アプリ 一覧",
  "個人開発アプリ おすすめ",
  "AIツール 個人開発 日本",
  "Chrome拡張機能 おすすめ 日本人",
  "個人開発者 スカウト",
  "フリーランス エンジニア 探し方",
  "スタートアップ 提携 探す",
  "個人開発アプリ 買収",
] as const;

export function siteKeywords(...extra: string[]): string[] {
  return [...SITE_KEYWORDS, ...extra];
}

export function publicPageMetadata({
  title,
  description,
  path,
  image,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
}): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${getSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;

  return {
    title,
    description,
    keywords: siteKeywords(...(keywords ?? [])),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "ja_JP",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export const DEFAULT_SITE_DESCRIPTION =
  "個人開発アプリ・スタートアップの成果物を掲載・公開し、SEOで宣伝できるポートフォリオプラットフォーム。日本製アプリの紹介やアプリリリース告知に。";

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
}): string {
  const summary = buildMetaDescription(product.catch_copy, product.description);
  return summary === DEFAULT_SITE_DESCRIPTION ? product.title : summary;
}
