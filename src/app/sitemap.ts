import type { MetadataRoute } from "next";
import { siteUrl } from "@/components/seo/metadata";
import { getPublicBlogPosts, getPublicModules } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl();
  const [modules, blogPosts] = await Promise.all([getPublicModules(), getPublicBlogPosts()]);
  const coreRoutes = ["", "/about", "/product", "/security-compliance", "/blogs", "/faq", "/contact", "/privacy", "/terms", "/accessibility"];
  const staticEntries: MetadataRoute.Sitemap = coreRoutes.map((path, index) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path === "/product" ? 0.9 : 0.7,
  }));
  const moduleEntries: MetadataRoute.Sitemap = modules.map((item) => ({
    url: `${baseUrl}/product/${item.slug}`,
    changeFrequency: "monthly",
    priority: 0.75,
  }));
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.65,
  }));
  return [...staticEntries, ...moduleEntries, ...blogEntries];
}
