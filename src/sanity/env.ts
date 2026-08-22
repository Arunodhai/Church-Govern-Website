const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
  undefined;
const dataset =
  process.env.SANITY_STUDIO_DATASET?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
  undefined;
const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() ||
  "2026-08-19";

export const sanityEnv = {
  projectId,
  dataset,
  apiVersion,
  studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL?.trim() || "/studio",
  isConfigured: Boolean(projectId && dataset),
} as const;

export function requireSanityEnv() {
  if (!sanityEnv.projectId || !sanityEnv.dataset) {
    throw new Error(
      "Sanity is not configured. Set SANITY_STUDIO_PROJECT_ID/SANITY_STUDIO_DATASET for Studio and NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET for Next.js.",
    );
  }

  return {
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    studioUrl: sanityEnv.studioUrl,
  };
}
