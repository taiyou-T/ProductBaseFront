import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serverApi } from "@/lib/api";
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
