import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth";
import { adminCollections } from "../collections";
import { logout } from "../login/actions";
import { AdminNavigation } from "@/components/admin/admin-navigation";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const visibleCollections = adminCollections.filter((collection) => collection.roles.includes(admin.profile.role));

  return (
    <div className="admin-shell min-h-screen bg-slate-950 text-slate-100">
      {admin.mode === "demo" && (
        <div className="bg-amber-300 px-4 py-2 text-center text-sm font-semibold text-amber-950">
          Development demo mode — all operational records and metrics are illustrative; screen-only changes are not persisted.
        </div>
      )}
      <div className="mx-auto min-h-[calc(100vh-36px)] max-w-[1800px] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-slate-950 p-5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/admin" className="block">
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-emerald-400">Church Govern</span>
              <span className="mt-1 block text-xl font-semibold">Operations</span>
            </Link>
            <AdminNavigation collections={visibleCollections} />
          </div>
          <div className="mt-8 hidden border-t border-white/10 pt-5 lg:block">
            <p className="truncate text-sm font-medium">{admin.profile.display_name}</p>
            <p className="mt-1 text-xs capitalize text-slate-400">{admin.profile.role.replaceAll("_", " ")}</p>
            {admin.mode === "live" && <form action={logout}><button className="mt-4 text-sm text-slate-400 hover:text-white">Sign out</button></form>}
          </div>
        </aside>
        <main className="min-w-0 bg-[#f7f7f4] p-5 text-slate-950 sm:p-8 lg:p-10 xl:p-12">{children}</main>
      </div>
    </div>
  );
}
