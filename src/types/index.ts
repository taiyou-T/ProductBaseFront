export type DevelopmentStatus =
  | "planning"
  | "developing"
  | "testing"
  | "beta"
  | "released"
  | "ended";

export type ApprovalStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "archived";

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductStory {
  target_users: string | null;
  solved_problem: string | null;
  main_features: string | null;
  motivation: string | null;
  development_period: string | null;
  difficulties: string | null;
  future_plans: string | null;
}

export interface ProductImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export type ReportReason =
  | "spam"
  | "copyright"
  | "fake"
  | "inappropriate"
  | "other";

export type SubscriptionPlanType = "supporter" | "standard" | "premium";

export interface CreatorProfile {
  id: number;
  user_id?: number;
  display_name: string;
  slug: string;
  bio: string | null;
  location: string | null;
  website_url: string | null;
  github_url: string | null;
  x_url: string | null;
  cover_url: string | null;
  chat_status: "open" | "supporter_only" | "closed";
  plan_type: "free_trial" | "standard" | "premium";
  trial_ends_at: string | null;
  can_list?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_creator: boolean;
  is_supporter: boolean;
  terms_agreed_version: number | null;
  current_terms_version: number;
  needs_terms_agreement: boolean;
  creator_profile: CreatorProfile | null;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  catch_copy: string | null;
  description: string | null;
  service_url: string | null;
  app_store_url: string | null;
  play_store_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
  development_status: DevelopmentStatus;
  approval_status?: ApprovalStatus;
  rejection_reason?: string | null;
  is_public: boolean;
  published_at: string | null;
  view_count: number;
  favorite_count: number;
  is_published: boolean;
  category: Category | null;
  tags: Tag[];
  story: ProductStory | null;
  images: ProductImage[];
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  website_url: string | null;
  github_url: string | null;
  x_url: string | null;
  logo_url: string | null;
  cover_url: string | null;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  creator_user_id: number;
  viewer_user_id: number;
  created_at: string;
  messages?: Message[];
}

export interface Message {
  id: number;
  sender_user_id: number;
  message: string;
  read_at: string | null;
  created_at: string;
}

export interface Subscription {
  id: number;
  plan_type: SubscriptionPlanType;
  status: "active" | "canceled" | "past_due" | "trialing";
  started_at: string;
  ended_at: string | null;
  is_active: boolean;
}
