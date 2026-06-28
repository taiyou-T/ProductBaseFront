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
          : "mx-auto grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2"
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
              ? "group block w-full max-w-[220px] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md sm:max-w-[260px] md:max-w-[280px] dark:border-zinc-800 dark:bg-zinc-900"
              : "group block overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          }
        >
          <div className="relative aspect-[2/1] w-full bg-zinc-50 dark:bg-zinc-800/80">
            <span className="absolute left-1.5 top-1.5 z-10 rounded bg-zinc-900/60 px-1 py-px text-[9px] font-medium text-white backdrop-blur-sm">
              広告
            </span>
            <Image
              src={ad.image_url}
              alt={ad.name}
              fill
              className="object-contain p-1 transition group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 220px, 280px"
              unoptimized
            />
          </div>
          <p className="truncate px-2 py-1.5 text-center text-[10px] text-zinc-500 dark:text-zinc-400">
            {ad.name}
          </p>
        </Link>
      ))}
    </aside>
  );
}
