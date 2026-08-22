import { describe, expect, it } from "vitest";
import { leadWorkflowUpdateSchema, moderationWorkflowUpdateSchema } from "./admin";

describe("operational admin validation", () => {
  it("accepts a lead workflow update and rejects unknown fields", () => {
    expect(leadWorkflowUpdateSchema.parse({ status: "contacted", internal_notes: "Called the church office." })).toEqual({ status: "contacted", internal_notes: "Called the church office." });
    expect(leadWorkflowUpdateSchema.safeParse({ status: "new", title: "CMS content belongs in Sanity" }).success).toBe(false);
  });

  it("accepts only supported moderation states", () => {
    expect(moderationWorkflowUpdateSchema.parse({ status: "approved" })).toEqual({ status: "approved" });
    expect(moderationWorkflowUpdateSchema.safeParse({ status: "published" }).success).toBe(false);
  });
});
