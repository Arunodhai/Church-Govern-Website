import { afterEach, describe, expect, it } from "vitest";
import { absoluteUrl, publicMetadata } from "./metadata";

const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  if (previousSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
});

describe("public SEO metadata", () => {
  it("creates a stable absolute canonical from a route", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://churchgovern.example/";
    expect(absoluteUrl("/blogs/a-useful-post")).toBe("https://churchgovern.example/blogs/a-useful-post");
  });

  it("uses approved overrides and honors noindex", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://churchgovern.example";
    const metadata = publicMetadata("/about", { title: "About", description: "Fallback" }, {
      title: "About Church Govern",
      description: "Approved description",
      canonicalUrl: "/about-us",
      noindex: true,
    });
    expect(metadata.title).toBe("About Church Govern");
    expect(metadata.description).toBe("Approved description");
    expect(metadata.alternates?.canonical).toBe("https://churchgovern.example/about-us");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});

