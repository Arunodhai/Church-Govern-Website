import { describe, expect, it } from "vitest";
import { mockBlogs, mockFaqs, mockGalleries, mockModules, mockPages, mockTestimonials, shouldUseMockContent } from "./mock-data";

describe("development mock content", () => {
  it("is impossible to enable in production", () => {
    expect(shouldUseMockContent("production", "true", "production")).toBe(false);
    expect(shouldUseMockContent("development", "true", "development")).toBe(true);
    expect(shouldUseMockContent("development", "false", "development")).toBe(false);
    expect(shouldUseMockContent("production", "true", "staging")).toBe(true);
  });

  it("covers the public content collections", () => {
    expect(mockPages).toHaveLength(7);
    expect(mockModules).toHaveLength(17);
    expect(mockBlogs).toHaveLength(6);
    expect(mockFaqs.filter((item) => !item.moduleSlug)).toHaveLength(10);
    expect(mockModules.every((item) => item.screenshots.length >= 2)).toBe(true);
    expect(mockModules.every((item) => mockFaqs.filter((faq) => faq.moduleSlug === item.slug).length >= 2)).toBe(true);
    expect(mockBlogs.every((item) => item.media && item.rating)).toBe(true);
    expect(mockTestimonials.length).toBeGreaterThan(0);
    expect(mockGalleries[0].items).toHaveLength(2);
  });

  it("labels testimonial identities and gallery descriptions as mock data", () => {
    expect(mockTestimonials.every((item) => `${item.name} ${item.churchName}`.toLowerCase().includes("mock") || `${item.name} ${item.churchName}`.toLowerCase().includes("development"))).toBe(true);
    expect(mockGalleries.every((item) => `${item.name} ${item.description}`.toLowerCase().includes("development") || `${item.name} ${item.description}`.toLowerCase().includes("mock"))).toBe(true);
  });
});
