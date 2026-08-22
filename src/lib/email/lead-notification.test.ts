import { beforeEach, describe, expect, it, vi } from "vitest";

const resendMocks = vi.hoisted(() => ({
  constructorKeys: [] as string[],
  send: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendMocks.send };

    constructor(apiKey: string) {
      resendMocks.constructorKeys.push(apiKey);
    }
  },
}));

import { sendLeadNotification } from "./lead-notification";

const lead = {
  type: "contact" as const,
  name: "Thomas",
  email: "thomas@example.com",
  subject: "Records",
  message: "I would like more information about record management.",
  consent: true as const,
};

const configuredEnv = {
  RESEND_API_KEY: "test-key",
  RESEND_FROM_EMAIL: "Church Govern <leads@example.com>",
  LEAD_NOTIFICATION_EMAIL: "owner@example.com, team@example.com",
};

beforeEach(() => {
  resendMocks.constructorKeys.length = 0;
  resendMocks.send.mockReset();
});

describe("Resend lead notifications", () => {
  it("does not make a network request when configuration is incomplete", async () => {
    await expect(sendLeadNotification("lead-1", lead, { env: {} })).resolves.toEqual({
      status: "not_configured",
    });
    expect(resendMocks.send).not.toHaveBeenCalled();
    expect(resendMocks.constructorKeys).toEqual([]);
  });

  it("sends with a record-based idempotency key when fully configured", async () => {
    resendMocks.send.mockResolvedValue({ data: { id: "email-1" }, error: null });

    await expect(sendLeadNotification("lead-2", lead, { env: configuredEnv })).resolves.toEqual({ status: "sent" });

    expect(resendMocks.constructorKeys).toEqual(["test-key"]);
    expect(resendMocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: configuredEnv.RESEND_FROM_EMAIL,
        to: ["owner@example.com", "team@example.com"],
        subject: "New Church Govern contact enquiry",
      }),
      { idempotencyKey: "lead-notification/contact/lead-2" },
    );
  });

  it("reports provider and network failures without throwing", async () => {
    resendMocks.send.mockResolvedValueOnce({
      data: null,
      error: { name: "application_error", message: "Unavailable", statusCode: 503 },
    });
    await expect(sendLeadNotification("lead-3", lead, { env: configuredEnv })).resolves.toEqual({ status: "failed" });

    resendMocks.send.mockRejectedValueOnce(new Error("network unavailable"));
    await expect(sendLeadNotification("lead-4", lead, { env: configuredEnv })).resolves.toEqual({ status: "failed" });
  });

  it("treats unsafe sender or recipient values as unconfigured", async () => {
    await expect(
      sendLeadNotification("lead-5", lead, {
        env: { ...configuredEnv, RESEND_FROM_EMAIL: "sender@example.com\r\nBcc: attacker@example.com" },
      }),
    ).resolves.toEqual({ status: "not_configured" });
    await expect(
      sendLeadNotification("lead-6", lead, {
        env: { ...configuredEnv, LEAD_NOTIFICATION_EMAIL: "not-an-email" },
      }),
    ).resolves.toEqual({ status: "not_configured" });
    expect(resendMocks.send).not.toHaveBeenCalled();
    expect(resendMocks.constructorKeys).toEqual([]);
  });
});
