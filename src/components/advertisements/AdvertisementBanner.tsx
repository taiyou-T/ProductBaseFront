import Image from "next/image";
import Link from "next/link";
import type { Advertisement } from "@/types";

export function AdvertisementBanner({ advertisements }: { advertisements: Advertisement[] }) {
  if (advertisements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {advertisements.map((ad) => (
        <Link
          key={ad.id}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="relative aspect-[3/1] w-full bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={ad.image_url}
              alt={ad.name}
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
          <p className="px-4 py-2 text-xs text-zinc-500">広告 · {ad.name}</p>
        </Link>
      ))}
    </div>
  );
}
