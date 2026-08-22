import { describe, expect, it } from "vitest";
import { asStringList, encodeStoragePath, normalizeSeo } from "./normalize";

describe("content normalization", () => {
  it("accepts both editor and database SEO field names", () => {
    expect(normalizeSeo({ title: "Module", canonical_url: "/product/module", noindex: false, keywords: ["church", 4] })).toEqual({
      title: "Module",
      description: undefined,
      canonicalUrl: "/product/module",
      noindex: false,
      imageUrl: undefined,
      keywords: ["church"],
    });
  });

  it("rejects non-string list values", () => {
    expect(asStringList(["one", null, 2, "two"])).toEqual(["one", "two"]);
    expect(asStringList("one")).toEqual([]);
  });

  it("encodes each storage path segment without losing folders", () => {
    expect(encodeStoragePath("gallery/Parish day 1.jpg")).toBe("gallery/Parish%20day%201.jpg");
  });
});
