"use client";

import { formatJapanDatetime } from "@/lib/datetime";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { Button } from "@/components/ui/Button";
import type { Notification } from "@/types";

export function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: number) => void;
}) {
  return (
    <li
      className={`p-4 ${!notification.is_read ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{notification.title}</p>
          {notification.body && (
            <div className="mt-1">
              <ExpandableText text={notification.body} />
            </div>
          )}
          <time
            dateTime={notification.created_at}
            className="mt-2 block text-xs text-zinc-400"
          >
            {formatJapanDatetime(notification.created_at)}
          </time>
        </div>
        {!notification.is_read && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onMarkRead(notification.id)}
            className="!px-2 !py-1 text-xs"
          >
            既読
          </Button>
        )}
      </div>
    </li>
  );
}
