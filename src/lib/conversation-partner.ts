import type { Conversation, ConversationParticipant } from "@/types";

export function getConversationPartner(
  conversation: Conversation,
  currentUserId: number,
): ConversationParticipant | null {
  if (conversation.creator_user_id === currentUserId) {
    return conversation.viewer ?? null;
  }
  if (conversation.viewer_user_id === currentUserId) {
    return conversation.creator ?? null;
  }
  return null;
}

export function getConversationPartnerDisplayName(
  conversation: Conversation,
  currentUserId: number,
): string {
  const partner = getConversationPartner(conversation, currentUserId);
  return partner?.display_name ?? partner?.name ?? "ユーザー";
}
