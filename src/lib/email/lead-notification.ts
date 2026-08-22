import "server-only";

import { Resend } from "resend";
import type { LeadRequest } from "@/lib/validation/forms";
import { buildLeadNotification } from "./lead-template";

type ResendConfiguration = {
  apiKey: string;
  from: string;
  recipients: string[];
};

type EmailEnvironment = {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  LEAD_NOTIFICATION_EMAIL?: string;
};

export type LeadNotificationStatus = "sent" | "not_configured" | "failed";

export type LeadNotificationResult = {
  status: LeadNotificationStatus;
};

type NotificationDependencies = {
  env?: EmailEnvironment;
};

const EMAIL_ADDRESS = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const NAMED_EMAIL_ADDRESS = /^[^\r\n<>]+<([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)>$/;

function isValidFromAddress(value: string): boolean {
  if (/[\r\n]/.test(value)) return false;
  if (EMAIL_ADDRESS.test(value)) return true;
  const namedAddress = value.match(NAMED_EMAIL_ADDRESS);
  return namedAddress ? EMAIL_ADDRESS.test(namedAddress[1]) : false;
}

function getResendConfiguration(env: EmailEnvironment): ResendConfiguration | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM_EMAIL?.trim();
  const recipientValue = env.LEAD_NOTIFICATION_EMAIL?.trim();
  if (!apiKey || !from || !recipientValue || !isValidFromAddress(from)) return null;

  const recipients = recipientValue
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
  if (recipients.length === 0 || recipients.some((recipient) => !EMAIL_ADDRESS.test(recipient))) {
    return null;
  }

  return { apiKey, from, recipients };
}

/**
 * Sends a best-effort notification after Supabase has accepted a lead.
 * The result deliberately cannot represent the persisted lead as failed.
 */
export async function sendLeadNotification(
  referenceId: string,
  lead: LeadRequest,
  dependencies: NotificationDependencies = {},
): Promise<LeadNotificationResult> {
  try {
    const environment = dependencies.env ?? {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      LEAD_NOTIFICATION_EMAIL: process.env.LEAD_NOTIFICATION_EMAIL,
    };
    const configuration = getResendConfiguration(environment);
    if (!configuration) return { status: "not_configured" };

    const message = buildLeadNotification(referenceId, lead);
    const resend = new Resend(configuration.apiKey);
    const response = await resend.emails.send(
      {
        from: configuration.from,
        to: configuration.recipients,
        subject: message.subject,
        text: message.text,
        html: message.html,
      },
      { idempotencyKey: `lead-notification/${lead.type}/${referenceId}` },
    );

    return { status: response.error || !response.data ? "failed" : "sent" };
  } catch {
    return { status: "failed" };
  }
}
