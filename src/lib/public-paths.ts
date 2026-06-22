import type { CreatorProfile, Product } from "@/types";

export function productPublicPath(product: Pick<Product, "id" | "slug">): string {
  return `/products/${product.id}-${product.slug}`;
}

export function developerPublicPath(
  profile: Pick<CreatorProfile, "slug"> & { user_id?: number | null },
): string {
  if (profile.user_id == null) {
    return `/developers/${profile.slug}`;
  }
  return `/developers/${profile.user_id}-${profile.slug}`;
}

export function productPublicApiPath(identifier: string): string {
  return `/public/products/${encodeURIComponent(identifier)}`;
}

export function developerPublicApiPath(identifier: string): string {
  return `/public/developers/${encodeURIComponent(identifier)}`;
}

export function isCanonicalProductPath(identifier: string, product: Pick<Product, "id" | "slug">): boolean {
  return identifier === `${product.id}-${product.slug}`;
}

export function isCanonicalDeveloperPath(
  identifier: string,
  profile: Pick<CreatorProfile, "slug"> & { user_id?: number | null },
): boolean {
  if (profile.user_id == null) return identifier === profile.slug;
  return identifier === `${profile.user_id}-${profile.slug}`;
}
