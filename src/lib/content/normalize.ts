import type { PublicSeo } from "./types";

type UnknownRow = Record<string, unknown>;

export function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function normalizeSeo(value: unknown): PublicSeo {
  const row: UnknownRow = value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRow : {};
  const optionalText = (candidate: unknown) => typeof candidate === "string" && candidate.trim() ? candidate : undefined;
  return {
    title: optionalText(row.title),
    description: optionalText(row.description),
    canonicalUrl: optionalText(row.canonicalUrl ?? row.canonical_url),
    noindex: typeof row.noindex === "boolean" ? row.noindex : undefined,
    imageUrl: optionalText(row.imageUrl ?? row.image_url),
    keywords: asStringList(row.keywords),
  };
}

export function encodeStoragePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}
