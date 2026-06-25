import type { User } from "@/types";

/** サポーター、または掲載者（無料掲載・Premium）のみチャット一覧を閲覧可能 */
export function canAccessChat(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.is_supporter) return true;
  if (user.is_creator && user.creator_profile?.can_list !== false) return true;
  return false;
}
