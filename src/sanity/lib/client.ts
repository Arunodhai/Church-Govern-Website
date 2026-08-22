import "server-only";

import { createClient } from "next-sanity";
import { sanityEnv } from "@/sanity/env";

const readToken = process.env.SANITY_API_READ_TOKEN?.trim() || undefined;

export const sanityClient = sanityEnv.isConfigured
  ? createClient({
      projectId: sanityEnv.projectId!,
      dataset: sanityEnv.dataset!,
      apiVersion: sanityEnv.apiVersion,
      token: readToken,
      useCdn: !readToken,
      perspective: "published",
      stega: { studioUrl: sanityEnv.studioUrl },
    })
  : null;

export function getSanityClient() {
  if (!sanityClient) {
    throw new Error(
      "Sanity content was requested before NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET were configured.",
    );
  }

  return sanityClient;
}
