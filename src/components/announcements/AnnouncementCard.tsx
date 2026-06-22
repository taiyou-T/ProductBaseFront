"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { formatJapanDatetime } from "@/lib/datetime";
import type { Announcement } from "@/types";

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (expanded) return;

    const el = bodyRef.current;
    if (!el) return;

    const checkTruncation = () => {
      setTruncated(el.scrollHeight > el.clientHeight + 1);
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);

    return () => window.removeEventListener("resize", checkTruncation);
  }, [announcement.body, expanded]);

  const showToggle = truncated || expanded;

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-medium">{announcement.title}</h3>
      {announcement.published_at && (
        <time
          dateTime={announcement.published_at}
          className="mt-1 block text-xs text-zinc-500 dark:text-zinc-500"
        >
          {formatJapanDatetime(announcement.published_at)}
        </time>
      )}
      <p
        ref={bodyRef}
        className={
          expanded
            ? "mt-1 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400"
            : "mt-1 line-clamp-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400"
        }
      >
        {announcement.body}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          aria-expanded={expanded}
        >
          {expanded ? "閉じる" : "続きを読む"}
        </button>
      )}
    </li>
  );
}
