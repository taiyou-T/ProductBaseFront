import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { publicPageMetadata, buildMetaDescription } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildOrganizationJsonLd } from "@/lib/seo-jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Organization, PaginatedResponse, Product } from "@/types";

async function getOrganization(slug: string) {
  try {
    const res = await serverApi<{ data: Organization }>(`/public/organizations/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrganization(slug);
  if (!org) return { title: "団体が見つかりません" };

  return publicPageMetadata({
    title: `${org.name} - 団体プロフィール`,
    description: buildMetaDescription(
      org.description,
      `${org.name} が ProductBase に掲載した成果物の一覧`,
    ),
    path: `/organizations/${slug}`,
    image: org.logo_url,
    keywords: [org.name, "スタートアップ", "個人開発"],
  });
}

async function getOrganizationProducts(slug: string) {
  try {
    const res = await serverApi<PaginatedResponse<Product>>(
      `/public/organizations/${slug}/products`,
    );
    return res.data;
  } catch {
    return [];
  }
}

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = await getOrganization(slug);
  if (!org) notFound();

  const products = await getOrganizationProducts(slug);

  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          buildOrganizationJsonLd(org),
          buildBreadcrumbJsonLd([
            { name: "ホーム", path: "/" },
            { name: "団体", path: "/products" },
            { name: org.name, path: `/organizations/${slug}` },
          ]),
        ]}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {org.logo_url && (
          <div className="relative h-24 w-24 overflow-hidden rounded-xl">
            <Image src={org.logo_url} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{org.name}</h1>
          {org.description && (
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">{org.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {org.website_url && (
              <a href={org.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
                Website
              </a>
            )}
            {org.github_url && (
              <a href={org.github_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
                GitHub
              </a>
            )}
            {org.x_url && (
              <a href={org.x_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
                X
              </a>
            )}
          </div>
        </div>
      </div>
      <section>
        <h2 className="mb-4 text-xl font-semibold">公開成果物</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
