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

export function publicPageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${getSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;

  return {
    title,
    description,
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
  "個人開発者・スタートアップの成果物を掲載し、SEO で発信するプラットフォーム";

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
