import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serverApi } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import { DeveloperActions } from "@/components/developers/DeveloperActions";
import type { CreatorProfile, PaginatedResponse, Product } from "@/types";

async function getDeveloper(slug: string) {
  try {
    const res = await serverApi<{ data: CreatorProfile }>(`/public/developers/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

async function getDeveloperProducts(slug: string) {
  try {
    const res = await serverApi<PaginatedResponse<Product>>(
      `/public/developers/${slug}/products`,
    );
    return res.data;
  } catch {
    return [];
  }
}

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getDeveloper(slug);
  if (!profile) notFound();

  const products = await getDeveloperProducts(slug);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {profile.cover_url && (
          <div className="relative h-32 w-full overflow-hidden rounded-xl sm:w-48">
            <Image src={profile.cover_url} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.display_name}</h1>
          {profile.bio && (
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">{profile.bio}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
                Website
              </a>
            )}
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
                GitHub
              </a>
            )}
            {profile.x_url && (
              <a href={profile.x_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
                X
              </a>
            )}
          </div>
          {profile.user_id && (
            <div className="mt-4">
              <DeveloperActions
                creatorUserId={profile.user_id}
                chatStatus={profile.chat_status}
              />
            </div>
          )}
        </div>
      </div>
      <section>
        <h2 className="mb-4 text-xl font-semibold">公開成果物</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
