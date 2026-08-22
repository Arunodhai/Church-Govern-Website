import "server-only";

import { redirect } from "next/navigation";
import { isMockOperationsMode } from "@/lib/demo-mode";
import { isSupabaseConfigured } from "./config";
import type { AppRole, ProfileRow } from "./database.types";
import { createSupabaseServerClient } from "./server";

export type AdminContext =
  | { mode: "demo"; userId: "demo"; email: "demo@churchgovern.local"; profile: ProfileRow }
  | { mode: "live"; userId: string; email: string; profile: ProfileRow };

const adminRoles: AppRole[] = [
  "super_admin",
  "content_editor",
  "seo_manager",
  "lead_manager",
  "moderator",
  "analyst",
];

export async function getAdminContext(): Promise<AdminContext | null> {
  if (isMockOperationsMode()) {
    const now = new Date(0).toISOString();
    return {
      mode: "demo",
      userId: "demo",
      email: "demo@churchgovern.local",
      profile: {
        id: "demo",
        display_name: "Demo administrator",
        role: "super_admin",
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    };
  }

  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!profile || !adminRoles.includes(profile.role)) return null;
  return {
    mode: "live",
    userId: authData.user.id,
    email: authData.user.email ?? "",
    profile,
  };
}

export async function requireAdmin(): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context) redirect("/admin/login");
  return context;
}
