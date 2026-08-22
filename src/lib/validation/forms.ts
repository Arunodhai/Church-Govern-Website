import { z } from "zod";

const cleanText = (label: string, min: number, max: number) =>
  z.string().trim().min(min, `${label} is required.`).max(max, `${label} is too long.`);
const email = z.string().trim().toLowerCase().email("Enter a valid email address.").max(254);
const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(24)
  .regex(/^\+?[0-9 ()-]+$/, "Enter a valid phone number.");
const pincode = z.string().trim().min(3, "Enter a valid postal code.").max(12);
const consent = z.literal(true, { error: "Consent is required before submitting." });
const source = z.string().trim().max(120).optional();
const utm = z
  .object({
    source: z.string().trim().max(120).optional(),
    medium: z.string().trim().max(120).optional(),
    campaign: z.string().trim().max(160).optional(),
    term: z.string().trim().max(160).optional(),
    content: z.string().trim().max(160).optional(),
  })
  .strict()
  .optional();

export const demoRequestSchema = z
  .object({
    type: z.literal("demo"),
    churchName: cleanText("Church name", 2, 160),
    denomination: cleanText("Denomination", 2, 120),
    contactPerson: cleanText("Contact person", 2, 100),
    email,
    phone,
    country: cleanText("Country", 2, 80),
    state: cleanText("State", 2, 100),
    district: cleanText("District", 2, 100),
    city: cleanText("City", 2, 100),
    pincode,
    consent,
    source,
    utm,
    website: z.string().max(0).optional(),
  })
  .strict();

export const digitizationRequestSchema = z
  .object({
    type: z.literal("digitization"),
    churchName: cleanText("Church name", 2, 160),
    contactPerson: cleanText("Contact person", 2, 100),
    email,
    phone,
    recordType: z.enum(["old", "new", "both"]),
    approximatePages: z.coerce.number().int().positive().max(10_000_000).optional(),
    pageSizes: z.array(cleanText("Page size", 1, 40)).min(1).max(12),
    state: cleanText("State", 2, 100),
    district: cleanText("District", 2, 100),
    location: cleanText("Location", 2, 160),
    pincode,
    comments: z.string().trim().max(2000).optional(),
    consent,
    source,
    utm,
    website: z.string().max(0).optional(),
  })
  .strict();

export const contactRequestSchema = z
  .object({
    type: z.literal("contact"),
    name: cleanText("Name", 2, 100),
    email,
    phone: phone.optional(),
    subject: cleanText("Subject", 3, 180),
    message: cleanText("Message", 10, 3000),
    consent,
    source,
    website: z.string().max(0).optional(),
  })
  .strict();

export const leadRequestSchema = z.discriminatedUnion("type", [
  demoRequestSchema,
  digitizationRequestSchema,
  contactRequestSchema,
]);

export const topicSuggestionSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    email: email.optional(),
    topic: cleanText("Topic", 3, 180),
    description: cleanText("Description", 10, 1500),
    website: z.string().max(0).optional(),
  })
  .strict();

export const blogCommentSchema = z
  .object({
    name: cleanText("Name", 2, 80),
    email,
    body: cleanText("Comment", 2, 1500),
    website: z.string().max(0).optional(),
  })
  .strict();

export const blogRatingSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5),
  })
  .strict();

export const loginSchema = z.object({
  email,
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
});

export type LeadRequest = z.infer<typeof leadRequestSchema>;

