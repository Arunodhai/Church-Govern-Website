import { describe, expect, it } from "vitest";

import { buildLeadNotification, escapeHtml } from "./lead-template";

describe("lead notification templates", () => {
  it("escapes every HTML-significant character", () => {
    expect(escapeHtml(`<script data-test="x">Tom & Jerry's</script>`)).toBe(
      "&lt;script data-test=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/script&gt;",
    );
  });

  it("renders demo fields without putting PII in the subject", () => {
    const message = buildLeadNotification("lead-123", {
      type: "demo",
      churchName: "Grace <Church>",
      denomination: "Independent",
      contactPerson: "Asha Thomas",
      email: "asha@example.com",
      phone: "+91 98765 43210",
      country: "India",
      state: "Kerala",
      district: "Ernakulam",
      city: "Kochi",
      pincode: "682001",
      consent: true,
    });

    expect(message.subject).toBe("New Church Govern demo request");
    expect(message.subject).not.toContain("Asha");
    expect(message.text).toContain("Reference:\nlead-123");
    expect(message.html).toContain("Grace &lt;Church&gt;");
    expect(message.html).not.toContain("Grace <Church>");
  });

  it("renders optional digitization details only when supplied", () => {
    const message = buildLeadNotification("lead-456", {
      type: "digitization",
      churchName: "Grace Church",
      contactPerson: "Asha Thomas",
      email: "asha@example.com",
      phone: "+91 98765 43210",
      recordType: "both",
      approximatePages: 2500,
      pageSizes: ["A4", "Ledger"],
      state: "Kerala",
      district: "Ernakulam",
      location: "Kochi",
      pincode: "682001",
      comments: "Handle with care & keep flat.",
      consent: true,
    });

    expect(message.text).toContain("Approximate pages:\n2500");
    expect(message.text).toContain("Page sizes:\nA4, Ledger");
    expect(message.html).toContain("Handle with care &amp; keep flat.");
  });

  it("renders contact fields and preserves multiline messages safely", () => {
    const message = buildLeadNotification("lead-789", {
      type: "contact",
      name: "Thomas",
      email: "thomas@example.com",
      subject: "Records",
      message: "First line\nSecond <line>",
      consent: true,
    });

    expect(message.text).toContain("Message:\nFirst line\nSecond <line>");
    expect(message.html).toContain("First line\nSecond &lt;line&gt;");
    expect(message.html).not.toContain("Phone");
  });
});
