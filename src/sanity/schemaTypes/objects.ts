import { defineArrayMember, defineField, defineType } from "sanity";

type PortableTextValue = Array<{
  _type?: string;
  children?: Array<{ text?: string }>;
}>;

export function portableTextWordCount(value?: PortableTextValue) {
  return (value ?? [])
    .flatMap((item) => item.children ?? [])
    .flatMap((child) => (child.text ?? "").trim().split(/\s+/))
    .filter(Boolean).length;
}

export function portableTextImageCount(value?: PortableTextValue) {
  return (value ?? []).filter((item) => item._type === "inlineImage").length;
}

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for people who cannot see it. Do not repeat the caption.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const image = context.parent as { asset?: unknown } | undefined;
          if (!image?.asset) return true;
          if (!value?.trim()) return "Alternative text is required when an image is selected.";
          if (value.trim().length < 3) return "Alternative text must be at least 3 characters.";
          if (value.length > 180) return "Alternative text must be 180 characters or fewer.";
          return true;
        }),
    }),
    defineField({ name: "caption", title: "Caption", type: "string", validation: (Rule) => Rule.max(240) }),
    defineField({ name: "credit", title: "Credit / license note", type: "string", validation: (Rule) => Rule.max(180) }),
  ],
});

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (Rule) => Rule.required().min(2).max(60) }),
    defineField({
      name: "internalPath",
      title: "Internal path",
      type: "string",
      description: "For example /about or /product/church-dashboard.",
      validation: (Rule) => Rule.custom((value) => !value || value.startsWith("/") || "Internal paths must start with /."),
    }),
    defineField({ name: "externalUrl", title: "External URL", type: "url", validation: (Rule) => Rule.uri({ scheme: ["https", "mailto", "tel"] }) }),
    defineField({ name: "openInNewTab", title: "Open in new tab", type: "boolean", initialValue: false }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      const linkValue = value as { internalPath?: string; externalUrl?: string } | undefined;
      if (!linkValue?.internalPath && !linkValue?.externalUrl) return "Choose an internal path or external URL.";
      if (linkValue.internalPath && linkValue.externalUrl) return "Use either an internal path or an external URL, not both.";
      return true;
    }),
  preview: { select: { title: "label", internalPath: "internalPath", externalUrl: "externalUrl" }, prepare: ({ title, internalPath, externalUrl }) => ({ title, subtitle: internalPath || externalUrl }) },
});

export const navigationItem = defineType({
  name: "navigationItem",
  title: "Navigation item",
  type: "object",
  fields: [
    ...link.fields,
    defineField({
      name: "children",
      title: "Child links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.max(8),
    }),
  ],
  validation: link.validation,
  preview: link.preview,
});

export const seo = defineType({
  name: "seo",
  title: "Search and social metadata",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: "metaTitle", title: "Meta title", type: "string", validation: (Rule) => Rule.max(60).warning("Search results may truncate titles longer than 60 characters.") }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3, validation: (Rule) => Rule.max(160).warning("Search results may truncate descriptions longer than 160 characters.") }),
    defineField({ name: "canonicalUrl", title: "Canonical URL", type: "url", validation: (Rule) => Rule.uri({ scheme: ["https"] }) }),
    defineField({ name: "openGraphImage", title: "Social sharing image", type: "imageWithAlt" }),
    defineField({ name: "keywords", title: "Keywords", type: "array", of: [defineArrayMember({ type: "string" })], validation: (Rule) => Rule.unique().max(12) }),
    defineField({ name: "noIndex", title: "Prevent search indexing", type: "boolean", initialValue: false }),
    defineField({
      name: "schemaType",
      title: "Schema.org type",
      type: "string",
      options: { list: ["WebPage", "AboutPage", "ContactPage", "FAQPage", "Product", "Article"] },
      initialValue: "WebPage",
    }),
  ],
});

export const hero = defineType({
  name: "hero",
  title: "Hero / banner",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string", validation: (Rule) => Rule.max(60) }),
    defineField({ name: "heading", type: "string", validation: (Rule) => Rule.required().min(4).max(110) }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (Rule) => Rule.max(280) }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({ name: "actions", type: "array", of: [defineArrayMember({ type: "link" })], validation: (Rule) => Rule.max(2) }),
  ],
});

export const inlineImage = defineType({
  name: "inlineImage",
  title: "Inline image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alternative text", type: "string", validation: (Rule) => Rule.required().min(3).max(180) }),
    defineField({ name: "caption", type: "string", validation: (Rule) => Rule.max(240) }),
  ],
  validation: (Rule) => Rule.required(),
});

export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{ title: "Bulleted", value: "bullet" }, { title: "Numbered", value: "number" }],
      marks: {
        decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }],
        annotations: [
          defineField({
            name: "externalLink",
            title: "External link",
            type: "object",
            fields: [
              defineField({ name: "href", type: "url", validation: (Rule) => Rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }) }),
              defineField({ name: "openInNewTab", type: "boolean", initialValue: true }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "inlineImage" }),
  ],
});

export const contentSection = defineType({
  name: "contentSection",
  title: "Content section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string", validation: (Rule) => Rule.max(60) }),
    defineField({ name: "heading", type: "string", validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: "body", type: "portableText" }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({ name: "links", type: "array", of: [defineArrayMember({ type: "link" })], validation: (Rule) => Rule.max(3) }),
    defineField({ name: "layout", type: "string", options: { list: ["text", "image-left", "image-right", "cards"] }, initialValue: "text" }),
  ],
  preview: { select: { title: "heading", subtitle: "eyebrow", media: "image" } },
});

export const callToAction = defineType({
  name: "callToAction",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (Rule) => Rule.required().max(100) }),
    defineField({ name: "summary", type: "text", rows: 2, validation: (Rule) => Rule.max(220) }),
    defineField({ name: "link", type: "link", validation: (Rule) => Rule.required() }),
  ],
});

export const footerColumn = defineType({
  name: "footerColumn",
  title: "Footer column",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (Rule) => Rule.required().max(50) }),
    defineField({ name: "links", type: "array", of: [defineArrayMember({ type: "link" })], validation: (Rule) => Rule.required().min(1).max(8) }),
  ],
});

export const analyticsSettings = defineType({
  name: "analyticsSettings",
  title: "Analytics identifiers",
  type: "object",
  description: "Public measurement identifiers only. Never store API secrets here.",
  fields: [
    defineField({ name: "ga4MeasurementId", title: "GA4 measurement ID", type: "string", validation: (Rule) => Rule.regex(/^G-[A-Z0-9]+$/).warning("Expected a GA4 ID such as G-XXXXXXXXXX.") }),
    defineField({ name: "metaPixelId", title: "Meta Pixel ID (optional)", type: "string", validation: (Rule) => Rule.regex(/^\d+$/).warning("Meta Pixel IDs contain digits only.") }),
  ],
});

export const schemaObjectTypes = [
  imageWithAlt,
  link,
  navigationItem,
  seo,
  hero,
  inlineImage,
  portableText,
  contentSection,
  callToAction,
  footerColumn,
  analyticsSettings,
];
