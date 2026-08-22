import { describe, expect, it } from "vitest";
import { isMockContentMode, isMockEngagementMode, isMockOperationsMode, resolveAppEnvironment } from "./demo-mode";

describe("deployment demo boundaries", () => {
  it("resolves explicit and Vercel preview environments conservatively", () => {
    expect(resolveAppEnvironment("staging", null, "production")).toBe("staging");
    expect(resolveAppEnvironment(null, "preview", "production")).toBe("staging");
    expect(resolveAppEnvironment(null, "production", "production")).toBe("production");
  });

  it("allows labelled content fixtures in staging but never production", () => {
    expect(isMockContentMode("production", "true", "staging")).toBe(true);
    expect(isMockContentMode("production", "true", "production")).toBe(false);
    expect(isMockContentMode("development", "false", "development")).toBe(false);
  });

  it("keeps staging operations live by default and production always live", () => {
    expect(isMockOperationsMode("development", null, "development")).toBe(true);
    expect(isMockOperationsMode("production", null, "staging")).toBe(false);
    expect(isMockOperationsMode("production", "true", "staging")).toBe(true);
    expect(isMockOperationsMode("production", "true", "production")).toBe(false);
  });

  it("uses mock engagement only when both content and operations are mocked", () => {
    expect(isMockEngagementMode("development", "true", "true", "development")).toBe(true);
    expect(isMockEngagementMode("production", "true", "false", "staging")).toBe(false);
    expect(isMockEngagementMode("production", "true", "true", "production")).toBe(false);
  });
});
