"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { developerPublicPath } from "@/lib/public-paths";

export function ProductDeveloperLine({
  displayName,
  slug,
  userId,
}: {
  displayName: string;
  slug?: string | null;
  userId?: number | null;
}) {
  const { user, hydrated } = useAuthStore();

  if (!hydrated || !user) {
    return null;
  }

  const href = slug && userId != null
    ? developerPublicPath({ user_id: userId, slug })
    : null;

  return (
    <p className="text-sm">
      開発者:{" "}
      {href ? (
        <Link href={href} className="text-indigo-600 hover:underline">
          {displayName}
        </Link>
      ) : (
        displayName
      )}
    </p>
  );
}
