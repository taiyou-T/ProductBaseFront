"use client";

import { CreatorFavoriteButton } from "@/components/developers/CreatorFavoriteButton";
import { StartChatButton } from "@/components/developers/StartChatButton";

export function DeveloperActions({
  creatorUserId,
  chatStatus,
}: {
  creatorUserId: number;
  chatStatus: "open" | "supporter_only" | "closed";
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <CreatorFavoriteButton creatorUserId={creatorUserId} />
      <StartChatButton creatorUserId={creatorUserId} chatStatus={chatStatus} />
    </div>
  );
}
