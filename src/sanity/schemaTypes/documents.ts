import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextImageCount, portableTextWordCount } from "./objects";

const contentStatusField = defineField({
  name: "contentStatus",
  title: "Content approval",
  type: "string",
  options: { list: [{ title: "Provisional / needs approval", value: "provisional" }, { title: "Approved for public use", value: "approved" }], layout: "radio" },
  initialValue: "provisional",
  validation: (Rule) => Rule.required(),
});

const slugField = (source: string = "title") =>
  defineField({
    name: "slug",
    type: "slug",
    options: { source, maxLength: 96 },
    validation: (Rule) => Rule.required(),
  });

export const page = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (Rule) => Rule.required().max(100) }),
    { ...slugField(), group: "content" },
    defineField({
      name: "pageKind",
      title: "Page type",
      type: "string",
      group: "content",
      options: { list: ["home", "about", "product", "blogs", "faq", "contact", "security-compliance", "legal", "general"] },
      validation: (Rule) => Rule.required(),
    }),
    { ...contentStatusField, group: "content" },
    defineField({ name: "hero", type: "hero", group: "content" }),
    defineField({ name: "sections", type: "array", group: "content", of: [defineArrayMember({ type: "contentSection" }), defineArrayMember({ type: "callToAction" })] }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "pageKind", media: "hero.image" } },
});

export const productSuite = defineType({
  name: "productSuite",
  title: "Product suites",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (Rule) => Rule.required().max(80) }),
    { ...slugField(), group: "content" },
    defineField({ name: "eyebrow", type: "string", group: "content", validation: (Rule) => Rule.max(60) }),
    defineField({ name: "summary", type: "text", rows: 3, group: "content", validation: (Rule) => Rule.required().max(280) }),
    defineField({ name: "body", type: "portableText", group: "content" }),
    defineField({ name: "heroImage", type: "imageWithAlt", group: "content" }),
    defineField({ name: "gallery", type: "array", group: "content", of: [defineArrayMember({ type: "imageWithAlt" })], validation: (Rule) => Rule.max(12) }),
    defineField({ name: "order", type: "number", group: "content", initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
    { ...contentStatusField, group: "content" },
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
});

export const productModule = defineType({
  name: "productModule",
  title: "Product modules",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "media", title: "Media" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "name", type: "string", group: "content", validation: (Rule) => Rule.required().max(100) }),
    { ...slugField("name"), group: "content" },
    defineField({ name: "suite", type: "reference", group: "content", to: [{ type: "productSuite" }], validation: (Rule) => Rule.required() }),
    defineField({ name: "eyebrow", type: "string", group: "content", validation: (Rule) => Rule.max(70) }),
    defineField({ name: "summary", type: "text", rows: 3, group: "content", validation: (Rule) => Rule.required().max(280) }),
    defineField({ name: "overview", type: "portableText", group: "content" }),
    defineField({ name: "benefits", type: "array", group: "content", of: [defineArrayMember({ type: "string", validation: (Rule) => Rule.max(160) })], validation: (Rule) => Rule.max(10) }),
    defineField({ name: "features", type: "array", group: "content", of: [defineArrayMember({ type: "string", validation: (Rule) => Rule.max(160) })], validation: (Rule) => Rule.max(16) }),
    defineField({ name: "workflow", type: "array", group: "content", of: [defineArrayMember({ type: "string", validation: (Rule) => Rule.max(180) })], validation: (Rule) => Rule.max(10) }),
    defineField({ name: "relatedModules", type: "array", group: "content", of: [defineArrayMember({ type: "reference", to: [{ type: "productModule" }] })], validation: (Rule) => Rule.unique().max(6) }),
    defineField({ name: "callToAction", type: "callToAction", group: "content" }),
    defineField({ name: "gallery", type: "array", group: "media", of: [defineArrayMember({ type: "imageWithAlt" })], validation: (Rule) => Rule.max(16) }),
    defineField({ name: "order", type: "number", group: "content", initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
    { ...contentStatusField, group: "content" },
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "name", subtitle: "suite.title", media: "gallery.0" } },
});

export const blogCategory = defineType({
  name: "blogCategory",
  title: "Blog categories",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required().max(60) }),
    slugField(),
    defineField({ name: "description", type: "text", rows: 2, validation: (Rule) => Rule.max(200) }),
  ],
});

export const blogTag = defineType({
  name: "blogTag",
  title: "Blog tags",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required().max(40) }),
    slugField(),
  ],
});

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog posts",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (Rule) => Rule.required().min(8).max(120) }),
    { ...slugField(), group: "content" },
    defineField({ name: "excerpt", type: "text", rows: 3, group: "content", validation: (Rule) => Rule.required().min(40).max(280) }),
    defineField({ name: "authorName", title: "Author / editorial byline", type: "string", group: "content", validation: (Rule) => Rule.required().max(100) }),
    defineField({ name: "publishedAt", type: "datetime", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "category", type: "reference", group: "content", to: [{ type: "blogCategory" }], validation: (Rule) => Rule.required() }),
    defineField({ name: "tags", type: "array", group: "content", of: [defineArrayMember({ type: "reference", to: [{ type: "blogTag" }] })], validation: (Rule) => Rule.unique().max(8) }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail / featured image",
      description: "Exactly one thumbnail is required per post.",
      type: "imageWithAlt",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      type: "portableText",
      group: "content",
      description: "Maximum 2,000 words and two inline images.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const body = value as Parameters<typeof portableTextWordCount>[0];
          const words = portableTextWordCount(body);
          const images = portableTextImageCount(body);
          if (words > 2000) return `Blog body has ${words.toLocaleString()} words; the maximum is 2,000.`;
          if (images > 2) return `Blog body has ${images} inline images; the maximum is two.`;
          return true;
        }),
    }),
    defineField({ name: "featured", type: "boolean", group: "content", initialValue: false }),
    defineField({ name: "popular", type: "boolean", group: "content", initialValue: false, description: "Editorial override; Supabase engagement metrics may also inform the public popular list." }),
    { ...contentStatusField, group: "content" },
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "thumbnail" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQs",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (Rule) => Rule.required().min(8).max(180) }),
    defineField({ name: "answer", type: "text", rows: 5, validation: (Rule) => Rule.required().min(20).max(1200) }),
    defineField({ name: "category", type: "string", options: { list: ["Product", "Pricing", "Security", "Digitization", "Deployment", "Support", "Implementation"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "order", type: "number", initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
    contentStatusField,
  ],
  preview: { select: { title: "question", subtitle: "category" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonials / community voice",
  type: "document",
  description: "Only publish client-supplied testimonials with recorded permission.",
  fields: [
    defineField({ name: "quote", type: "text", rows: 5, validation: (Rule) => Rule.required().min(20).max(700) }),
    defineField({ name: "personName", type: "string", validation: (Rule) => Rule.required().max(100) }),
    defineField({ name: "role", type: "string", validation: (Rule) => Rule.max(100) }),
    defineField({ name: "organization", type: "string", validation: (Rule) => Rule.max(120) }),
    defineField({ name: "portrait", type: "imageWithAlt" }),
    defineField({ name: "publicationConsent", title: "Publication permission confirmed", type: "boolean", initialValue: false, validation: (Rule) => Rule.required().custom((value) => value === true || "Explicit publication permission is required.") }),
    defineField({ name: "order", type: "number", initialValue: 0, validation: (Rule) => Rule.integer().min(0) }),
    contentStatusField,
  ],
  preview: { select: { title: "personName", subtitle: "organization", media: "portrait" } },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required().max(80) }),
    defineField({ name: "location", type: "string", options: { list: ["header", "footer", "utility"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "navigationItem" })], validation: (Rule) => Rule.required().min(1).max(10) }),
  ],
});

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer settings",
  type: "document",
  fields: [
    defineField({ name: "heading", type: "string", validation: (Rule) => Rule.max(100) }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (Rule) => Rule.max(280) }),
    defineField({ name: "columns", type: "array", of: [defineArrayMember({ type: "footerColumn" })], validation: (Rule) => Rule.max(4) }),
    defineField({ name: "legalLinks", type: "array", of: [defineArrayMember({ type: "link" })], validation: (Rule) => Rule.max(6) }),
    defineField({ name: "copyrightText", type: "string", validation: (Rule) => Rule.max(140) }),
  ],
});

export const gallery = defineType({
  name: "gallery",
  title: "Galleries",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required().max(100) }),
    slugField(),
    defineField({ name: "description", type: "text", rows: 3, validation: (Rule) => Rule.max(280) }),
    defineField({ name: "images", type: "array", of: [defineArrayMember({ type: "imageWithAlt" })], validation: (Rule) => Rule.required().min(1).max(30) }),
    contentStatusField,
  ],
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [{ name: "identity", title: "Identity", default: true }, { name: "contact", title: "Contact" }, { name: "seo", title: "SEO and analytics" }],
  fields: [
    defineField({ name: "title", title: "Website name", type: "string", group: "identity", validation: (Rule) => Rule.required().max(80) }),
    defineField({ name: "organizationName", type: "string", group: "identity", validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: "brandRelationship", type: "text", rows: 3, group: "identity", description: "Approved relationship between Church Govern, FamilyaConnect and SBL Knowledge Services.", validation: (Rule) => Rule.max(400) }),
    defineField({
      name: "siteUrl",
      type: "url",
      group: "identity",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          try {
            const url = new URL(value);
            return url.protocol === "https:" || url.hostname === "localhost" || "Use HTTPS outside localhost.";
          } catch {
            return "Enter a valid absolute URL.";
          }
        }),
    }),
    defineField({ name: "description", type: "text", rows: 3, group: "identity", validation: (Rule) => Rule.max(280) }),
    defineField({ name: "logo", type: "imageWithAlt", group: "identity" }),
    defineField({ name: "contactEmail", type: "string", group: "contact", validation: (Rule) => Rule.email() }),
    defineField({ name: "contactPhone", type: "string", group: "contact", validation: (Rule) => Rule.max(40) }),
    defineField({ name: "address", type: "text", rows: 3, group: "contact", validation: (Rule) => Rule.max(300) }),
    defineField({ name: "socialLinks", type: "array", group: "contact", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }), defineField({ name: "url", type: "url", validation: (Rule) => Rule.required().uri({ scheme: ["https"] }) })] })], validation: (Rule) => Rule.max(8) }),
    defineField({ name: "defaultSeo", type: "seo", group: "seo" }),
    defineField({ name: "analytics", type: "analyticsSettings", group: "seo" }),
  ],
});

export const schemaDocumentTypes = [
  page,
  productSuite,
  productModule,
  blogCategory,
  blogTag,
  blogPost,
  faq,
  testimonial,
  navigation,
  footerSettings,
  gallery,
  siteSettings,
];
