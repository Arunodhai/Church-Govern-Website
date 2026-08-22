import type { LeadRequest } from "@/lib/validation/forms";

type EmailField = readonly [label: string, value: string];

export type LeadNotificationMessage = {
  subject: string;
  text: string;
  html: string;
};

const leadLabels: Record<LeadRequest["type"], string> = {
  demo: "demo request",
  digitization: "digitization enquiry",
  contact: "contact enquiry",
};

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
}

function optionalField(label: string, value: string | number | undefined): EmailField[] {
  if (value === undefined || value === "") return [];
  return [[label, String(value)]];
}

function fieldsForLead(lead: LeadRequest): EmailField[] {
  if (lead.type === "demo") {
    return [
      ["Church", lead.churchName],
      ["Denomination", lead.denomination],
      ["Contact person", lead.contactPerson],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["Country", lead.country],
      ["State", lead.state],
      ["District", lead.district],
      ["City", lead.city],
      ["Postal code", lead.pincode],
      ...optionalField("Source", lead.source),
    ];
  }

  if (lead.type === "digitization") {
    return [
      ["Church", lead.churchName],
      ["Contact person", lead.contactPerson],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["Record type", lead.recordType],
      ...optionalField("Approximate pages", lead.approximatePages),
      ["Page sizes", lead.pageSizes.join(", ")],
      ["State", lead.state],
      ["District", lead.district],
      ["Location", lead.location],
      ["Postal code", lead.pincode],
      ...optionalField("Comments", lead.comments),
      ...optionalField("Source", lead.source),
    ];
  }

  return [
    ["Name", lead.name],
    ["Email", lead.email],
    ...optionalField("Phone", lead.phone),
    ["Subject", lead.subject],
    ["Message", lead.message],
    ...optionalField("Source", lead.source),
  ];
}

export function buildLeadNotification(referenceId: string, lead: LeadRequest): LeadNotificationMessage {
  const label = leadLabels[lead.type];
  const fields: EmailField[] = [["Reference", referenceId], ...fieldsForLead(lead)];
  const subject = `New Church Govern ${label}`;
  const text = [
    `A new ${label} was saved in Church Govern.`,
    "",
    ...fields.flatMap(([fieldLabel, value]) => [`${fieldLabel}:`, value, ""]),
  ]
    .join("\n")
    .trim();
  const rows = fields
    .map(
      ([fieldLabel, value]) =>
        `<tr><th scope="row" style="padding:8px 12px;text-align:left;vertical-align:top">${escapeHtml(fieldLabel)}</th><td style="padding:8px 12px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const html = `<p>A new ${escapeHtml(label)} was saved in Church Govern.</p><table role="presentation" style="border-collapse:collapse">${rows}</table>`;

  return { subject, text, html };
}
