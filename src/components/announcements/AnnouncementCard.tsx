"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { formatJapanDatetime } from "@/lib/datetime";
import type { Announcement } from "@/types";
import { ExpandableText } from "@/components/ui/ExpandableText";

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
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
      <div className="mt-1">
        <ExpandableText text={announcement.body} />
      </div>
    </li>
  );
}
