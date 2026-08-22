import { describe, expect, it } from "vitest";
import { mapSanityBlogPost, mapSanityImage, mapSanityModule, portableTextToPlainText } from "./sanity-mappers";

const block = (style: string, value: string) => ({ _type: "block", style, children: [{ _type: "span", text: value }] });

describe("Sanity public content mapping", () => {
  it("converts portable text without exposing its internal shape", () => {
    expect(portableTextToPlainText([block("normal", "First"), block("normal", "Second")])).toBe("First\n\nSecond");
  });

  it("maps projected image dimensions and accessible text", () => {
    expect(mapSanityImage({ alt: "Dashboard", asset: { _id: "image-1", url: "https://cdn.sanity.io/image.png", metadata: { dimensions: { width: 1200, height: 800 } } } })).toMatchObject({ id: "image-1", alt: "Dashboard", width: 1200, height: 800 });
  });

  it("maps member modules and related slugs", () => {
    expect(mapSanityModule({ _id: "m1", slug: "profile", name: "Profile", suite: { slug: "member-suite" }, overview: [block("normal", "Details")], relatedModules: [{ slug: "notifications" }] })).toMatchObject({ suite: "Member suite", overview: "Details", related: ["notifications"] });
  });

  it("groups blog rich text under its headings", () => {
    const post = mapSanityBlogPost({ _id: "b1", slug: "care", title: "Care", excerpt: "Summary", publishedAt: "2026-08-21T00:00:00Z", authorName: "Editorial team", body: [block("h2", "Start"), block("normal", "One"), block("normal", "Two")] });
    expect(post.sections).toEqual([{ heading: "Start", paragraphs: ["One", "Two"] }]);
  });
});
