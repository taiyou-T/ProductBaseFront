"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import type { Organization } from "@/types";

export default function OrganizationsPage() {
  const { token } = useAuthStore();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api<{ data: Organization[] }>("/creator/organizations", {}, token)
      .then((res) => setOrganizations(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">団体管理</h1>
        <Link href="/dashboard/organizations/new">
          <Button type="button">団体を作成</Button>
        </Link>
      </div>
      {loading ? (
        <p className="text-zinc-500">読み込み中...</p>
      ) : organizations.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
          所属団体はありません
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {organizations.map((org) => (
            <li key={org.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{org.name}</p>
                <Link
                  href={`/organizations/${org.slug}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  公開ページを見る
                </Link>
              </div>
              <Link href={`/dashboard/organizations/${org.id}/edit`}>
                <Button type="button" variant="secondary">
                  編集
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
