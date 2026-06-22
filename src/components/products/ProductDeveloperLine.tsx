"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";

export function ProductDeveloperLine({
  displayName,
  slug,
}: {
  displayName: string;
  slug?: string | null;
}) {
  const { user, hydrated } = useAuthStore();

  if (!hydrated || !user) {
    return null;
  }

  return (
    <p className="text-sm">
      開発者:{" "}
      {slug ? (
        <Link href={`/developers/${slug}`} className="text-indigo-600 hover:underline">
          {displayName}
        </Link>
      ) : (
        displayName
      )}
    </p>
  );
}
