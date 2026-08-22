import type { MetadataRoute } from "next";
import { siteUrl } from "@/components/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteUrl();
  const isProduction = process.env.APP_ENV === "production";

  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/", disallow: ["/admin/", "/studio/", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
