import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const configured = isSupabaseConfigured();
  const demoAllowed = !configured && process.env.NODE_ENV === "development";
  const existing = configured ? await getAdminContext() : null;
  if (existing?.mode === "live") redirect("/admin");
  const { next = "/admin" } = await searchParams;

  return (
    <main className="admin-login grid min-h-screen place-items-center bg-[#f5f7f8] px-5 py-12 text-slate-950">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#687413]">Church Govern</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Administration</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Sign in with an authorized Supabase account. Access is checked against your active operations role.</p>
        {configured ? (
          <LoginForm nextPath={next} />
        ) : demoAllowed ? (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-950">Demo mode is active</p>
            <p className="mt-1 text-sm leading-6 text-amber-900">Supabase environment variables are absent, so no content or enquiries will be saved.</p>
            <a href="/admin" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-amber-950 px-4 py-2.5 text-sm font-semibold text-white">Open read-only demo</a>
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-950">Administration is not configured</p>
            <p className="mt-1 text-sm leading-6 text-red-900">Required Supabase environment variables are missing. Access is disabled until the deployment owner completes the secure configuration.</p>
          </div>
        )}
      </section>
    </main>
  );
}
