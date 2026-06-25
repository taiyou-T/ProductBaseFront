/**
 * OpenAPI 由来の API 型（`npm run generate:api-types` で再生成）。
 * アプリ内の手書き型は `@/types`、API レスポンスの厳密型はこちらを優先。
 */
import type { components, operations, paths } from "./api.generated";

export type { components, operations, paths };

type Schemas = components["schemas"];

export type AnnouncementResource = Schemas["AnnouncementResource"];
export type CategoryResource = Schemas["CategoryResource"];
export type ConversationResource = Schemas["ConversationResource"];
export type CreatorProfileResource = Schemas["CreatorProfileResource"];
export type MessageResource = Schemas["MessageResource"];
export type NotificationResource = Schemas["NotificationResource"];
export type OrganizationResource = Schemas["OrganizationResource"];
export type ProductImageResource = Schemas["ProductImageResource"];
export type ProductResource = Schemas["ProductResource"];
export type ProductStoryResource = Schemas["ProductStoryResource"];
export type ReportResource = Schemas["ReportResource"];
export type SubscriptionResource = Schemas["SubscriptionResource"];
export type TagResource = Schemas["TagResource"];
export type UserResource = Schemas["UserResource"];

export type ApprovalStatus = Schemas["ApprovalStatus"];
export type DevelopmentStatus = Schemas["DevelopmentStatus"];
export type ChatStatus = Schemas["ChatStatus"];
export type CreatorPlanType = "free" | "premium";

/** Laravel ページネーション形式 */
export interface PaginatedApiResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
  };
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

/** 認証 API のレスポンス（register / login / google token） */
export type AuthTokenResponse = {
  token: string;
  user: UserResource;
};

/** OpenAPI 未収載の公開設定（site-config は Back の Scramble 反映後に生成型へ移行可） */
export type { SiteConfig } from "./site";
