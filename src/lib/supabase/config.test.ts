import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getSupabasePublicConfig,
  getSupabaseServiceRoleKey,
  isSupabaseConfigured,
} from "./config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Supabase environment configuration", () => {
  it("returns null when public configuration is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    expect(getSupabasePublicConfig()).toBeNull();
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("accepts an HTTPS Supabase URL with a non-empty anonymous key", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-anon-key");

    expect(getSupabasePublicConfig()).toEqual({
      url: "https://example.supabase.co",
      anonKey: "public-anon-key",
    });
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("allows HTTP only for local development hosts", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "local-anon-key");

    expect(getSupabasePublicConfig()).not.toBeNull();

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://example.supabase.co");
    expect(getSupabasePublicConfig()).toBeNull();

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "ftp://localhost:54321");
    expect(getSupabasePublicConfig()).toBeNull();
  });

  it("rejects malformed URLs and blank anonymous keys", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "not a URL");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-anon-key");
    expect(getSupabasePublicConfig()).toBeNull();

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "   ");
    expect(getSupabasePublicConfig()).toBeNull();
  });

  it("normalizes an optional server-only service role key", () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "  service-role-key  ");
    expect(getSupabaseServiceRoleKey()).toBe("service-role-key");

    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "   ");
    expect(getSupabaseServiceRoleKey()).toBeNull();
  });
});
