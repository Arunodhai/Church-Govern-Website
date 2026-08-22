import type { Metadata } from "next";
import { resolveAppEnvironment } from "@/lib/demo-mode";

export type PublicSeo = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  imageUrl?: string;
  keywords?: string[];
};

export const siteUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost = resolveAppEnvironment() === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    : process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return (configured || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")).replace(/\/$/, "");
};

export function absoluteUrl(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, `${siteUrl()}/`).toString();
  }
}

export function publicMetadata(path: string, fallback: { title: string; description: string }, seo?: PublicSeo): Metadata {
  const title = seo?.title?.trim() || fallback.title;
  const description = seo?.description?.trim() || fallback.description;
  const canonical = absoluteUrl(seo?.canonicalUrl?.trim() || path);
  const image = seo?.imageUrl ? absoluteUrl(seo.imageUrl) : undefined;
  const allowIndexing = resolveAppEnvironment() === "production" && !seo?.noindex;
  return {
    title,
    description,
    keywords: seo?.keywords,
    alternates: { canonical },
    robots: { index: allowIndexing, follow: allowIndexing },
    openGraph: { title, description, url: canonical, type: "website", ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}
