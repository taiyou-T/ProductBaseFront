import { SITE_NAME } from "@/lib/constants";
import { developerPublicPath, productPublicPath } from "@/lib/public-paths";
import { absoluteUrl, DEFAULT_SITE_DESCRIPTION } from "@/lib/seo";
import type { CreatorProfile, Organization, Product } from "@/types";

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: DEFAULT_SITE_DESCRIPTION,
    inLanguage: "ja-JP",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildProductJsonLd(product: Product) {
  const developer = product.user?.creator_profile;
  const pageUrl = absoluteUrl(productPublicPath(product));

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.title,
    description: product.catch_copy ?? product.description ?? undefined,
    url: pageUrl,
    image: product.thumbnail_url ?? undefined,
    applicationCategory: product.category?.name,
    datePublished: product.published_at ?? undefined,
    dateModified: product.updated_at ?? undefined,
    ...(developer && {
      author: {
        "@type": "Person",
        name: developer.display_name,
        url: absoluteUrl(
          developerPublicPath({ user_id: developer.user_id ?? product.user?.id, slug: developer.slug }),
        ),
      },
    }),
    ...(product.service_url ? { downloadUrl: product.service_url } : {}),
  };
}

export function buildPersonJsonLd(profile: CreatorProfile) {
  const sameAs = [profile.website_url, profile.github_url, profile.x_url].filter(
    (url): url is string => Boolean(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.display_name,
    description: profile.bio ?? undefined,
    url: absoluteUrl(developerPublicPath(profile)),
    image: profile.cover_url ?? undefined,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildOrganizationJsonLd(org: Organization) {
  const sameAs = [org.website_url, org.github_url, org.x_url].filter((url): url is string =>
    Boolean(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    description: org.description ?? undefined,
    url: absoluteUrl(`/organizations/${org.slug}`),
    logo: org.logo_url ?? undefined,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
