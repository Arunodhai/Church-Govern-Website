import { describe, expect, it } from "vitest";

import {
  blogCommentSchema,
  blogRatingSchema,
  demoRequestSchema,
  digitizationRequestSchema,
  leadRequestSchema,
  loginSchema,
  topicSuggestionSchema,
} from "./forms";

const validDemoRequest = {
  type: "demo" as const,
  churchName: "  Grace Church  ",
  denomination: "Independent",
  contactPerson: "Asha Thomas",
  email: "  ASHA@EXAMPLE.COM ",
  phone: "+91 98765 43210",
  country: "India",
  state: "Kerala",
  district: "Ernakulam",
  city: "Kochi",
  pincode: "682001",
  consent: true as const,
};

describe("lead request schemas", () => {
  it("normalizes a valid demo request", () => {
    const parsed = demoRequestSchema.parse(validDemoRequest);

    expect(parsed.churchName).toBe("Grace Church");
    expect(parsed.email).toBe("asha@example.com");
  });

  it("requires explicit consent and rejects unknown fields", () => {
    expect(demoRequestSchema.safeParse({ ...validDemoRequest, consent: false }).success).toBe(false);
    expect(demoRequestSchema.safeParse({ ...validDemoRequest, role: "super_admin" }).success).toBe(false);
  });

  it("validates and coerces the approved digitization fields", () => {
    const parsed = digitizationRequestSchema.parse({
      type: "digitization",
      churchName: "Grace Church",
      contactPerson: "Asha Thomas",
      email: "asha@example.com",
      phone: "+91 98765 43210",
      recordType: "both",
      approximatePages: "2500",
      pageSizes: ["A4", "Ledger"],
      state: "Kerala",
      district: "Ernakulam",
      location: "Kochi",
      pincode: "682001",
      consent: true,
    });

    expect(parsed.approximatePages).toBe(2500);
    expect(parsed.pageSizes).toEqual(["A4", "Ledger"]);
  });

  it("rejects an unsupported lead discriminator", () => {
    expect(leadRequestSchema.safeParse({ ...validDemoRequest, type: "newsletter" }).success).toBe(false);
  });
});

describe("engagement and authentication schemas", () => {
  it("allows an anonymous topic suggestion while validating its content", () => {
    expect(
      topicSuggestionSchema.safeParse({
        topic: "Church records",
        description: "Please cover responsible retention planning.",
      }).success,
    ).toBe(true);
    expect(topicSuggestionSchema.safeParse({ topic: "No", description: "Too short" }).success).toBe(false);
  });

  it("rejects honeypot content and invalid comment email", () => {
    expect(
      blogCommentSchema.safeParse({
        name: "Asha",
        email: "not-an-email",
        body: "A useful article.",
      }).success,
    ).toBe(false);
    expect(
      blogCommentSchema.safeParse({
        name: "Asha",
        email: "asha@example.com",
        body: "A useful article.",
        website: "spam.example",
      }).success,
    ).toBe(false);
  });

  it("coerces integral ratings and enforces the one-to-five range", () => {
    expect(blogRatingSchema.parse({ rating: "5" }).rating).toBe(5);
    expect(blogRatingSchema.safeParse({ rating: 0 }).success).toBe(false);
    expect(blogRatingSchema.safeParse({ rating: 6 }).success).toBe(false);
    expect(blogRatingSchema.safeParse({ rating: 3.5 }).success).toBe(false);
  });

  it("normalizes login email and enforces the password length boundary", () => {
    const parsed = loginSchema.parse({ email: " ADMIN@EXAMPLE.COM ", password: "password123" });
    expect(parsed.email).toBe("admin@example.com");
    expect(loginSchema.safeParse({ email: "admin@example.com", password: "short" }).success).toBe(false);
  });
});
