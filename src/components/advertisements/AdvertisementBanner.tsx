import Image from "next/image";
import Link from "next/link";
import type { Advertisement } from "@/types";

const AD_CARD_WIDTH = "w-[220px] sm:w-[240px]";

export function AdvertisementBanner({ advertisements }: { advertisements: Advertisement[] }) {
  if (advertisements.length === 0) {
    return null;
  }

  const isSingle = advertisements.length === 1;

  return (
    <aside aria-label="広告" className="w-full">
      <div
        className={
          isSingle
            ? "flex justify-center"
            : "-mx-4 overflow-x-auto px-4 pb-1 scroll-smooth sm:mx-0 sm:px-0 [scrollbar-width:thin]"
        }
      >
        <div
          className={`flex gap-3 ${isSingle ? "" : "snap-x snap-mandatory"}`}
          role={isSingle ? undefined : "list"}
        >
          {advertisements.map((ad) => (
            <Link
              key={ad.id}
              href={ad.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              role={isSingle ? undefined : "listitem"}
              className={`group ${AD_CARD_WIDTH} shrink-0 snap-start overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900`}
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
                  sizes="240px"
                  unoptimized
                />
              </div>
              <p className="truncate px-2 py-1.5 text-center text-[10px] text-zinc-500 dark:text-zinc-400">
                {ad.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
      {!isSingle && (
        <p className="mt-1 text-center text-[10px] text-zinc-400 dark:text-zinc-500">
          左右にスワイプして広告を見る
        </p>
      )}
    </aside>
  );
}
