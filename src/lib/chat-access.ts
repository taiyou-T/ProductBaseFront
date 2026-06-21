import type { User } from "@/types";

/** サポーター、または掲載プラン／無料トライアル中の掲載者のみチャット一覧を閲覧可能 */
export function canAccessChat(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.is_supporter) return true;
  if (user.is_creator && user.creator_profile?.can_list !== false) return true;
  return false;
}
