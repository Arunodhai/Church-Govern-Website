import type { NextRequest } from "next/server";
import { getAdminContext } from "@/lib/supabase/auth";
import { getCollection } from "@/app/admin/collections";
import { jsonFailure } from "@/lib/validation/api";

type Context = { params: Promise<{ collection: string }> };

export async function POST(_request: NextRequest, context: Context) {
  const { collection } = await context.params;
  const config = getCollection(collection);
  const admin = await getAdminContext();
  if (!config || !admin || !config.roles.includes(admin.profile.role)) return jsonFailure("Not authorized.", 403);
  return jsonFailure("Operational records are created by public workflows. Website content is managed in Sanity Studio.", 405);
}
