"use client";

import { useAuthStore } from "@/lib/auth-store";
import { ButtonLink } from "@/components/ui/Button";

export function HomeHeroActions() {
  const { user, hydrated } = useAuthStore();

  const isCreator = hydrated && user?.is_creator;
  const secondaryHref = hydrated && user ? "/dashboard/onboarding" : "/register";

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <ButtonLink href="/search" variant="secondary" className="!bg-white !text-indigo-700">
        成果物を探す
      </ButtonLink>
      {isCreator ? (
        <ButtonLink href="/dashboard/products" className="!bg-indigo-500 !text-white hover:!bg-indigo-400">
          成果物を掲載する
        </ButtonLink>
      ) : (
        <ButtonLink href={secondaryHref} className="!bg-indigo-500 !text-white hover:!bg-indigo-400">
          掲載者として登録
        </ButtonLink>
      )}
    </div>
  );
}
