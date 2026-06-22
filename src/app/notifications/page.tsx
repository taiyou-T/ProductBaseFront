"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/Button";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import type { Notification, PaginatedResponse } from "@/types";

export default function NotificationsPage() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api<PaginatedResponse<Notification>>("/notifications", {}, token)
      .then((res) => setNotifications(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const markRead = async (id: number) => {
    if (!token) return;
    await api(`/notifications/${id}/read`, { method: "PUT" }, token);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
  };

  const markAllRead = async () => {
    if (!token) return;
    await api("/notifications/read-all", { method: "POST" }, token);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">通知</h1>
          {notifications.some((n) => !n.is_read) && (
            <Button type="button" variant="secondary" onClick={markAllRead}>
              すべて既読
            </Button>
          )}
        </div>
        {loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : notifications.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
            通知はありません
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
            ))}
          </ul>
        )}
      </div>
    </RequireAuth>
  );
}
