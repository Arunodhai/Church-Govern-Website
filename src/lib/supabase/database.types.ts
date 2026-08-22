export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole =
  | "super_admin"
  | "content_editor"
  | "seo_manager"
  | "lead_manager"
  | "moderator"
  | "analyst";
export type PublishStatus = "draft" | "scheduled" | "published" | "archived";
export type ModerationStatus = "pending" | "approved" | "rejected" | "spam";
export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "spam";

type TableDefinition<Row extends Record<string, unknown>> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type Timestamped = { created_at: string; updated_at: string };

export type ProfileRow = Timestamped & {
  id: string;
  display_name: string;
  role: AppRole;
  is_active: boolean;
};

export type MediaAssetRow = {
  id: string;
  bucket_id: "site-media-private" | "site-media-public";
  storage_path: string;
  title: string | null;
  original_filename: string | null;
  alt_text: string;
  caption: string | null;
  mime_type: string;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  is_public: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentPageRow = Timestamped & {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  blocks: Json;
  status: PublishStatus;
  published_at: string | null;
  seo: Json;
  created_by: string | null;
  updated_by: string | null;
};

export type ProductModuleRow = Timestamped & {
  id: string;
  suite_id: string;
  name: string;
  slug: string;
  eyebrow: string;
  short_description: string;
  overview: string;
  icon_name: string | null;
  hero_media_id: string | null;
  benefits: Json;
  features: Json;
  workflow: Json;
  related_slugs: string[];
  seo: Json;
  sort_order: number;
  status: PublishStatus;
  published_at: string | null;
};

export type BlogPostRow = Timestamped & {
  id: string;
  category_id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  content: Json;
  author_name: string;
  read_time_minutes: number;
  thumbnail_id: string | null;
  inline_media_ids: string[];
  keywords: string[];
  status: PublishStatus;
  featured: boolean;
  published_at: string | null;
  seo: Json;
  created_by: string | null;
  updated_by: string | null;
};

export type ProductSuiteRow = Timestamped & {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_published: boolean;
};

export type ModuleScreenshotRow = {
  module_id: string;
  media_id: string;
  sort_order: number;
};

export type RelatedModuleRow = {
  module_id: string;
  related_module_id: string;
  sort_order: number;
};

export type BlogCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type BlogTagRow = { id: string; name: string; slug: string };
export type BlogPostTagRow = { post_id: string; tag_id: string };

export type GalleryRow = Timestamped & {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_published: boolean;
};

export type GalleryItemRow = { gallery_id: string; media_id: string; sort_order: number };

export type FaqRow = Timestamped & {
  id: string;
  category: string;
  question: string;
  answer: string;
  module_id: string | null;
  sort_order: number;
  is_published: boolean;
};

export type TestimonialRow = Timestamped & {
  id: string;
  member_name: string;
  church_name: string;
  designation: string | null;
  quote: string;
  image_id: string | null;
  sort_order: number;
  is_published: boolean;
};

export type NavigationItemRow = Timestamped & {
  id: string;
  parent_id: string | null;
  label: string;
  href: string;
  location: "header" | "footer" | "utility";
  sort_order: number;
  is_external: boolean;
  is_published: boolean;
};

export type DemoRequestRow = Timestamped & {
  id: string;
  church_name: string;
  denomination: string;
  contact_person: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  consent: boolean;
  status: LeadStatus;
  source: string | null;
  utm: Json;
  ip_hash: string | null;
  assigned_to: string | null;
  internal_notes: string | null;
};

export type DigitizationRequestRow = Timestamped & {
  id: string;
  church_name: string;
  contact_person: string;
  email: string;
  phone: string;
  record_type: "old" | "new" | "both";
  approximate_pages: number | null;
  page_sizes: string[];
  state: string;
  district: string;
  location: string;
  pincode: string;
  comments: string | null;
  consent: boolean;
  status: LeadStatus;
  source: string | null;
  utm: Json;
  ip_hash: string | null;
  assigned_to: string | null;
  internal_notes: string | null;
};

export type GeneralInquiryRow = Timestamped & {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  consent: boolean;
  status: LeadStatus;
  source: string | null;
  ip_hash: string | null;
  assigned_to: string | null;
  internal_notes: string | null;
};

export type BlogCommentRow = {
  id: string;
  post_id: string | null;
  blog_slug: string;
  name: string;
  email: string;
  body: string;
  status: ModerationStatus;
  ip_hash: string | null;
  user_agent: string | null;
  moderated_by: string | null;
  moderated_at: string | null;
  created_at: string;
};

export type BlogRatingRow = Timestamped & {
  id: string;
  post_id: string | null;
  blog_slug: string;
  rating: number;
  fingerprint_hash: string;
};

export type TopicSuggestionRow = {
  id: string;
  name: string | null;
  email: string | null;
  topic: string;
  description: string;
  status: ModerationStatus;
  ip_hash: string | null;
  created_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: Json;
  description: string | null;
  is_public: boolean;
  updated_by: string | null;
  updated_at: string;
};

export type AnalyticsRollupRow = {
  day: string;
  metric: string;
  dimension: string;
  value: number;
  source: string;
  updated_at: string;
};

export type AuditEventRow = {
  id: number;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Json | null;
  new_data: Json | null;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDefinition<ProfileRow>;
      media_assets: TableDefinition<MediaAssetRow>;
      content_pages: TableDefinition<ContentPageRow>;
      product_suites: TableDefinition<ProductSuiteRow>;
      product_modules: TableDefinition<ProductModuleRow>;
      module_screenshots: TableDefinition<ModuleScreenshotRow>;
      related_modules: TableDefinition<RelatedModuleRow>;
      blog_categories: TableDefinition<BlogCategoryRow>;
      blog_posts: TableDefinition<BlogPostRow>;
      blog_tags: TableDefinition<BlogTagRow>;
      blog_post_tags: TableDefinition<BlogPostTagRow>;
      faqs: TableDefinition<FaqRow>;
      testimonials: TableDefinition<TestimonialRow>;
      galleries: TableDefinition<GalleryRow>;
      gallery_items: TableDefinition<GalleryItemRow>;
      navigation_items: TableDefinition<NavigationItemRow>;
      demo_requests: TableDefinition<DemoRequestRow>;
      digitization_requests: TableDefinition<DigitizationRequestRow>;
      general_inquiries: TableDefinition<GeneralInquiryRow>;
      blog_comments: TableDefinition<BlogCommentRow>;
      blog_ratings: TableDefinition<BlogRatingRow>;
      topic_suggestions: TableDefinition<TopicSuggestionRow>;
      site_settings: TableDefinition<SiteSettingRow>;
      analytics_rollups: TableDefinition<AnalyticsRollupRow>;
      audit_events: TableDefinition<AuditEventRow>;
    };
    Views: Record<string, never>;
    Functions: {
      consume_rate_limit: {
        Args: {
          p_bucket: string;
          p_subject_hash: string;
          p_limit: number;
          p_window_seconds: number;
        };
        Returns: boolean;
      };
      get_approved_blog_comments: {
        Args: { p_post_id: string };
        Returns: { id: string; name: string; body: string; created_at: string }[];
      };
      get_blog_rating_summary: {
        Args: { p_post_id: string };
        Returns: { average: number; rating_count: number }[];
      };
      get_approved_blog_comments_by_slug: {
        Args: { p_blog_slug: string };
        Returns: { id: string; name: string; body: string; created_at: string }[];
      };
      get_blog_rating_summary_by_slug: {
        Args: { p_blog_slug: string };
        Returns: { average: number; rating_count: number }[];
      };
    };
    Enums: {
      app_role: AppRole;
      publish_status: PublishStatus;
      moderation_status: ModerationStatus;
      lead_status: LeadStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
