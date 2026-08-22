import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabasePublicConfig, getSupabaseServiceRoleKey } from "./config";
import type { Database } from "./database.types";

export async function createSupabaseServerClient(): Promise<SupabaseClient<Database> | null> {
  const config = getSupabasePublicConfig();
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. proxy.ts refreshes sessions.
        }
      },
    },
  });
}

export function createSupabaseAnonClient(): SupabaseClient<Database> | null {
  const config = getSupabasePublicConfig();
  if (!config) return null;
  return createClient<Database>(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function createSupabaseAdminClient(): SupabaseClient<Database> | null {
  const config = getSupabasePublicConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  if (!config || !serviceRoleKey) return null;
  return createClient<Database>(config.url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

