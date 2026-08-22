import { describe, expect, it } from "vitest";

import {
  blogPosts,
  faqCategories,
  faqs,
  memberSuite,
  modules,
  navItems,
  officeSuite,
} from "./site";

function expectUnique(values: string[]) {
  expect(new Set(values).size).toBe(values.length);
}

describe("site content contracts", () => {
  it("contains every required Office and Member suite module exactly once", () => {
    expect(officeSuite).toHaveLength(10);
    expect(memberSuite).toHaveLength(7);
    expect(modules).toHaveLength(17);
    expectUnique(modules.map((module) => module.slug));
    expectUnique(modules.map((module) => module.name));
  });

  it("keeps each module detail page complete and its related links valid", () => {
    const slugs = new Set(modules.map((module) => module.slug));

    for (const productModule of modules) {
      expect(productModule.summary.trim()).not.toBe("");
      expect(productModule.overview.trim()).not.toBe("");
      expect(productModule.benefits.length).toBeGreaterThan(0);
      expect(productModule.features.length).toBeGreaterThan(0);
      expect(productModule.workflow.length).toBeGreaterThan(0);
      expect(productModule.related.length).toBeGreaterThan(0);
      expect(productModule.related).not.toContain(productModule.slug);
      for (const relatedSlug of productModule.related) {
        expect(slugs.has(relatedSlug), `${productModule.slug} links to missing module ${relatedSlug}`).toBe(true);
      }
    }
  });

  it("keeps blog and navigation slugs unique and internal", () => {
    expectUnique(blogPosts.map((post) => post.slug));
    expectUnique(navItems.map((item) => item.href));

    for (const post of blogPosts) {
      expect(post.sections.length).toBeGreaterThan(0);
      expect(Number.isNaN(Date.parse(post.date))).toBe(false);
    }
    for (const item of navItems) {
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("uses only approved FAQ categories and represents every category", () => {
    const allowedCategories = new Set<string>(faqCategories);
    const representedCategories = new Set(faqs.map((faq) => faq.category));

    for (const faq of faqs) {
      expect(allowedCategories.has(faq.category)).toBe(true);
      expect(faq.question.trim()).not.toBe("");
      expect(faq.answer.trim()).not.toBe("");
    }
    expect(representedCategories).toEqual(allowedCategories);
  });
});
