import { describe, expect, it } from "vitest";

import { adminCollections, getCollection } from "./collections";

describe("administrator collection registry", () => {
  it("keeps collection keys unique and every collection role-protected", () => {
    const keys = adminCollections.map((collection) => collection.key);

    expect(new Set(keys).size).toBe(keys.length);
    for (const collection of adminCollections) {
      expect(collection.roles.length).toBeGreaterThan(0);
      expect(collection.label.trim()).not.toBe("");
      expect(collection.description.trim()).not.toBe("");
    }
  });

  it("includes the required launch moderation and analytics workspaces", () => {
    expect(getCollection("comments")?.kind).toBe("engagement");
    expect(getCollection("topic-suggestions")?.kind).toBe("engagement");
    expect(getCollection("analytics")?.kind).toBe("insight");
  });

  it("keeps Sanity-owned content out of the Supabase operations registry", () => {
    for (const key of ["pages", "modules", "blogs", "faqs", "testimonials", "navigation", "media"]) {
      expect(getCollection(key)).toBeUndefined();
    }
  });

  it("does not resolve unknown collections", () => {
    expect(getCollection("unknown")).toBeUndefined();
  });
});
