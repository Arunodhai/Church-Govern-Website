import { describe, expect, it } from "vitest";
import { createSanitySeedDocuments } from "./content";

describe("Sanity source migration", () => {
  it("creates the complete provisional source dataset with stable identifiers", () => {
    const documents = createSanitySeedDocuments({ siteUrl: "https://church-govern.example" });
    const count = (type: string) => documents.filter((document) => document._type === type).length;

    expect(documents).toHaveLength(51);
    expect(count("page")).toBe(7);
    expect(count("productSuite")).toBe(2);
    expect(count("productModule")).toBe(17);
    expect(count("blogPost")).toBe(6);
    expect(count("blogCategory")).toBe(6);
    expect(count("faq")).toBe(10);
    expect(count("testimonial")).toBe(0);
    expect(new Set(documents.map((document) => document._id)).size).toBe(documents.length);
    expect(documents.filter((document) => ["page", "productSuite", "productModule", "blogPost", "faq"].includes(document._type)).every((document) => document.contentStatus === "provisional")).toBe(true);
  });

  it("rejects insecure production site URLs", () => {
    expect(() => createSanitySeedDocuments({ siteUrl: "http://example.com" })).toThrow(/HTTPS/);
  });
});
