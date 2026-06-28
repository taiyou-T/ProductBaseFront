import Image from "next/image";
import Link from "next/link";
import type { Advertisement } from "@/types";

export function AdvertisementBanner({ advertisements }: { advertisements: Advertisement[] }) {
  if (advertisements.length === 0) {
    return null;
  }

  const isSingle = advertisements.length === 1;

  return (
    <aside
      aria-label="広告"
      className={
        isSingle
          ? "flex justify-center"
          : "mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
      }
    >
      {advertisements.map((ad) => (
        <Link
          key={ad.id}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={
            isSingle
              ? "group block w-full max-w-xs overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md sm:max-w-sm md:max-w-md lg:max-w-lg"
              : "group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          }
        >
          <div className="relative aspect-[16/10] w-full bg-zinc-50 dark:bg-zinc-800/80 sm:aspect-[16/9]">
            <span className="absolute left-2 top-2 z-10 rounded bg-zinc-900/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              広告
            </span>
            <Image
              src={ad.image_url}
              alt={ad.name}
              fill
              className="object-contain p-1 transition group-hover:scale-[1.02] sm:p-2"
              sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 512px"
              unoptimized
            />
          </div>
          <p className="truncate px-3 py-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
            {ad.name}
          </p>
        </Link>
      ))}
    </aside>
  );
}
