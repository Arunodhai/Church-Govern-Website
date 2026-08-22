import { afterEach, describe, expect, it } from "vitest";
import { absoluteUrl, publicMetadata, siteUrl } from "./metadata";

const trackedEnvironment = [
  "NEXT_PUBLIC_SITE_URL",
  "APP_ENV",
  "VERCEL_ENV",
  "VERCEL_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
] as const;
const previousEnvironment = Object.fromEntries(trackedEnvironment.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of trackedEnvironment) {
    const previous = previousEnvironment[key];
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
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

  it("uses the active Vercel deployment URL for staging canonicals", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.APP_ENV = "staging";
    process.env.VERCEL_URL = "church-govern-preview.vercel.app";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "church-govern-production.vercel.app";
    expect(siteUrl()).toBe("https://church-govern-preview.vercel.app");
  });
});
