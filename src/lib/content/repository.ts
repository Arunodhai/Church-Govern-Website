import "server-only";

import { isMockEngagementMode, isSanityContentDemoMode } from "@/lib/demo-mode";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sanityEnv } from "@/sanity/env";
import { fetchSanity } from "@/sanity/lib/fetch";
import {
  FAQS_QUERY,
  GALLERIES_QUERY,
  NAVIGATION_QUERY,
  PAGE_BY_SLUG_QUERY,
  PRODUCT_MODULES_QUERY,
  TESTIMONIALS_QUERY,
} from "@/sanity/lib/queries";
import {
  mapSanityBlogPost,
  mapSanityFaq,
  mapSanityGallery,
  mapSanityModule,
  mapSanityNavigation,
  mapSanityPage,
  mapSanityTestimonial,
  type SanityRecord,
} from "./sanity-mappers";
import {
  mockBlogs,
  mockFaqs,
  mockGalleries,
  mockModules,
  mockNavigation,
  mockPages,
  mockTestimonials,
  shouldUseMockContent,
} from "./mock-data";
import type {
  PublicBlogEngagement,
  PublicBlogPost,
  PublicFaq,
  PublicGallery,
  PublicModule,
  PublicNavigationItem,
  PublicPage,
  PublicSiteBundle,
  PublicTestimonial,
} from "./types";

export type {
  PublicBlogEngagement,
  PublicBlogPost,
  PublicFaq,
  PublicGallery,
  PublicMedia,
  PublicModule,
  PublicNavigationItem,
  PublicPage,
  PublicPageBlock,
  PublicSeo,
  PublicSiteBundle,
  PublicTestimonial,
} from "./types";

export const isMockContentEnabled = shouldUseMockContent();
const isSanityDemoEnabled = isSanityContentDemoMode();
const sanityVisibilityParams = { includeProvisional: isSanityDemoEnabled };

const FULL_BLOG_POSTS_QUERY = `
  *[_type == "blogPost" && ($includeProvisional == true || contentStatus == "approved") && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){
    _id, title, "slug": slug.current, excerpt, publishedAt, authorName, body, featured, popular,
    thumbnail{..., asset->{_id, url, metadata{dimensions}}},
    "category": category->{title, "slug": slug.current},
    "tags": tags[]->{title, "slug": slug.current},
    seo{metaTitle, metaDescription, canonicalUrl, noIndex, schemaType, keywords,
      openGraphImage{..., asset->{_id, url, metadata{dimensions}}}}
  }
`;

async function sanityRead<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!sanityEnv.isConfigured) return null;
  try {
    return await fetchSanity<T>(query, params, { revalidate: isSanityDemoEnabled ? 0 : 300, tags: ["sanity-content"] });
  } catch (error) {
    console.error("Sanity public content read failed.", error);
    return null;
  }
}

export async function getPublicPage(slug: string): Promise<PublicPage | null> {
  if (isMockContentEnabled) return mockPages.find((page) => page.slug === slug) ?? null;
  const page = await sanityRead<SanityRecord | null>(PAGE_BY_SLUG_QUERY, { slug, ...sanityVisibilityParams });
  return page ? mapSanityPage(page) : null;
}

export async function getPublicModules(): Promise<PublicModule[]> {
  if (isMockContentEnabled) return mockModules;
  const rows = await sanityRead<SanityRecord[]>(PRODUCT_MODULES_QUERY, sanityVisibilityParams);
  if (rows?.length) return rows.map((row) => {
    const productModule = mapSanityModule(row);
    if (!isSanityDemoEnabled || productModule.screenshots.length) return productModule;
    return {
      ...productModule,
      screenshots: [
        { id: `sanity-demo-${productModule.slug}-overview`, url: "/images/demo/module-overview.svg", alt: `Illustrative demo overview for ${productModule.name}`, caption: "Development demo UI concept — not a product screenshot", width: 1600, height: 1000 },
        { id: `sanity-demo-${productModule.slug}-workflow`, url: "/images/demo/module-workflow.svg", alt: `Illustrative demo workflow for ${productModule.name}`, caption: "Development demo UI concept — replace with approved product media", width: 1600, height: 1000 },
      ],
    };
  });
  return [];
}

export async function getPublicModule(slug: string): Promise<PublicModule | null> {
  return (await getPublicModules()).find((item) => item.slug === slug) ?? null;
}

export async function getPublicBlogPosts(): Promise<PublicBlogPost[]> {
  if (isMockContentEnabled) return mockBlogs;
  const rows = await sanityRead<SanityRecord[]>(FULL_BLOG_POSTS_QUERY, sanityVisibilityParams);
  if (rows?.length) return rows.map((row, index) => {
    const post = mapSanityBlogPost(row);
    if (!isSanityDemoEnabled || post.media) return post;
    return {
      ...post,
      media: {
        id: `sanity-demo-blog-${index + 1}`,
        url: index % 2 === 0 ? "/images/records-digitization.jpg" : "/images/church-community-hero.jpg",
        alt: index % 2 === 0 ? "Development demo thumbnail showing historical records" : "Development demo thumbnail showing a church community",
        caption: "Development demo thumbnail — replace before production",
      },
    };
  });
  return [];
}

export async function getPublicBlogPost(slug: string): Promise<PublicBlogPost | null> {
  return (await getPublicBlogPosts()).find((item) => item.slug === slug) ?? null;
}

export async function getPublicFaqs(): Promise<PublicFaq[]> {
  if (isMockContentEnabled) return mockFaqs;
  const rows = await sanityRead<SanityRecord[]>(FAQS_QUERY, sanityVisibilityParams);
  if (rows?.length) return rows.map(mapSanityFaq);
  return [];
}

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  if (isMockContentEnabled) return mockTestimonials;
  const rows = await sanityRead<SanityRecord[]>(TESTIMONIALS_QUERY, sanityVisibilityParams);
  return rows?.map(mapSanityTestimonial) ?? [];
}

export async function getPublicNavigation(location: PublicNavigationItem["location"] = "header"): Promise<PublicNavigationItem[]> {
  if (isMockContentEnabled) return mockNavigation.map((item) => ({ ...item, location }));
  const sanityLocation = location === "footer" ? "footer-secondary" : location;
  const document = await sanityRead<SanityRecord | null>(NAVIGATION_QUERY, { location: sanityLocation });
  if (document) return mapSanityNavigation(document, location);
  return [];
}

export async function getPublicGalleries(): Promise<PublicGallery[]> {
  if (isMockContentEnabled) return mockGalleries;
  const rows = await sanityRead<SanityRecord[]>(GALLERIES_QUERY, sanityVisibilityParams);
  return rows?.map(mapSanityGallery) ?? [];
}

export async function getPublicGallery(slug: string): Promise<PublicGallery | null> {
  return (await getPublicGalleries()).find((item) => item.slug === slug) ?? null;
}

export async function getBlogEngagement(slug: string): Promise<PublicBlogEngagement> {
  if (isMockEngagementMode() && mockBlogs.some((post) => post.slug === slug)) {
    return {
      comments: [
        { id: `mock-comment-${slug}-1`, name: "Mock reader", body: "Development-only approved comment for testing the public discussion layout.", created_at: "2026-08-20T10:00:00.000Z" },
        { id: `mock-comment-${slug}-2`, name: "Sample visitor", body: "This comment is mock data and was not submitted by a real visitor.", created_at: "2026-08-19T10:00:00.000Z" },
      ],
      rating: { average: 4.5, count: 12 },
    };
  }
  const client = createSupabaseAdminClient();
  const post = await getPublicBlogPost(slug);
  if (!client || !post) return { comments: [], rating: { average: 0, count: 0 } };
  const [commentsResult, ratingResult] = await Promise.all([
    client.rpc("get_approved_blog_comments_by_slug", { p_blog_slug: slug }),
    client.rpc("get_blog_rating_summary_by_slug", { p_blog_slug: slug }),
  ]);
  return {
    comments: (commentsResult.data ?? []).map((row) => ({ id: row.id, name: row.name, body: row.body, created_at: row.created_at })),
    rating: { average: Number(ratingResult.data?.[0]?.average ?? 0), count: Number(ratingResult.data?.[0]?.rating_count ?? 0) },
  };
}

export async function getPublicSiteBundle(): Promise<PublicSiteBundle> {
  const [moduleData, blogs, faqData, testimonials, navigation, galleries] = await Promise.all([
    getPublicModules(),
    getPublicBlogPosts(),
    getPublicFaqs(),
    getPublicTestimonials(),
    getPublicNavigation(),
    getPublicGalleries(),
  ]);
  return { modules: moduleData, blogs, faqs: faqData, testimonials, navigation, galleries };
}
