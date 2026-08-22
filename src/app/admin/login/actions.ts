"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/forms";

export type LoginState = { message?: string; errors?: Record<string, string[]> } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) redirect("/admin");
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Administration is not configured." };
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { message: "The email or password is incorrect." };
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();
  if (!profile) {
    await supabase.auth.signOut();
    return { message: "This account does not have administration access." };
  }
  const requested = String(formData.get("next") ?? "/admin");
  redirect(requested.startsWith("/admin") && !requested.startsWith("//") ? requested : "/admin");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

