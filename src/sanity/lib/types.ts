import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  asset?: { _ref?: string; url?: string; metadata?: { dimensions?: { width: number; height: number } } };
  alt: string;
  caption?: string;
  hotspot?: unknown;
  crop?: unknown;
};

export type SeoData = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  openGraphImage?: SanityImage;
  noIndex?: boolean;
  schemaType?: string;
  keywords?: string[];
};

export type LinkData = {
  label: string;
  internalPath?: string;
  externalUrl?: string;
  openInNewTab?: boolean;
};

export type ContentSection = {
  _key: string;
  _type: "contentSection";
  eyebrow?: string;
  heading: string;
  body?: PortableTextBlock[];
  image?: SanityImage;
  links?: LinkData[];
};

export type CmsPage = {
  _id: string;
  title: string;
  slug: string;
  pageKind: string;
  contentStatus: "provisional" | "approved";
  hero?: { eyebrow?: string; heading: string; summary?: string; image?: SanityImage; actions?: LinkData[] };
  sections?: ContentSection[];
  seo?: SeoData;
};

export type ProductModule = {
  _id: string;
  name: string;
  slug: string;
  suite?: { _id: string; title: string; slug: string };
  eyebrow?: string;
  summary: string;
  overview?: PortableTextBlock[];
  benefits?: string[];
  features?: string[];
  workflow?: string[];
  gallery?: SanityImage[];
  relatedModules?: Array<{ _id: string; name: string; slug: string }>;
  seo?: SeoData;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  authorName: string;
  thumbnail: SanityImage;
  category?: { title: string; slug: string };
  tags?: Array<{ title: string; slug: string }>;
  body: PortableTextBlock[];
  featured?: boolean;
  popular?: boolean;
  seo?: SeoData;
};
