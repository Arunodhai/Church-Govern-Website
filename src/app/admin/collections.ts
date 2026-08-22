import type { AppRole } from "@/lib/supabase/database.types";

export type AdminCollectionKey =
  | "demo-leads"
  | "digitization-leads"
  | "inquiries"
  | "comments"
  | "topic-suggestions"
  | "analytics"
  | "audit";

export type CollectionConfig = {
  key: AdminCollectionKey;
  label: string;
  description: string;
  roles: AppRole[];
  kind: "content" | "engagement" | "lead" | "insight";
};

export const adminCollections: CollectionConfig[] = [
  { key: "demo-leads", label: "Demo requests", description: "Personally identifiable lead records", roles: ["super_admin", "lead_manager"], kind: "lead" },
  { key: "digitization-leads", label: "Digitization enquiries", description: "Record digitization opportunities", roles: ["super_admin", "lead_manager"], kind: "lead" },
  { key: "inquiries", label: "Contact enquiries", description: "General website contact messages", roles: ["super_admin", "lead_manager"], kind: "lead" },
  { key: "comments", label: "Comment moderation", description: "Approve, reject, or flag blog comments", roles: ["super_admin", "moderator"], kind: "engagement" },
  { key: "topic-suggestions", label: "Topic suggestions", description: "Editorial suggestions awaiting review", roles: ["super_admin", "content_editor", "moderator"], kind: "engagement" },
  { key: "analytics", label: "Analytics", description: "Daily conversion and content rollups", roles: ["super_admin", "analyst"], kind: "insight" },
  { key: "audit", label: "Audit trail", description: "Immutable administrative change history", roles: ["super_admin", "analyst"], kind: "insight" },
];

export function getCollection(key: string) {
  return adminCollections.find((collection) => collection.key === key);
}
