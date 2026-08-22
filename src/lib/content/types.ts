export type PublicSeo = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  imageUrl?: string;
  keywords?: string[];
};

export type PublicMedia = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type PublicPageBlock = {
  heading: string;
  body: string;
  eyebrow?: string;
  image?: PublicMedia;
};

export type PublicPage = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  blocks: PublicPageBlock[];
  seo: PublicSeo;
  publishedAt?: string;
};

export type PublicModule = {
  id: string;
  slug: string;
  name: string;
  suite: "Office suite" | "Member suite";
  eyebrow: string;
  summary: string;
  overview: string;
  benefits: string[];
  features: string[];
  workflow: string[];
  related: string[];
  seo: PublicSeo;
  media?: PublicMedia;
  screenshots: PublicMedia[];
};

export type PublicBlogSection = { heading: string; paragraphs: string[] };

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  popular?: boolean;
  rating?: { average: number; count: number };
  sections: PublicBlogSection[];
  seo: PublicSeo;
  tags: string[];
  media?: PublicMedia;
};

export type PublicFaq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  moduleSlug?: string;
};

export type PublicTestimonial = {
  id: string;
  name: string;
  churchName: string;
  designation?: string;
  quote: string;
  image?: PublicMedia;
};

export type PublicNavigationItem = {
  id: string;
  href: string;
  label: string;
  location: "header" | "footer" | "utility";
  external: boolean;
  children: PublicNavigationItem[];
};

export type PublicGallery = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  items: PublicMedia[];
};

export type PublicBlogEngagement = {
  comments: { id: string; name: string; body: string; created_at: string }[];
  rating: { average: number; count: number };
};

export type PublicSiteBundle = {
  modules: PublicModule[];
  blogs: PublicBlogPost[];
  faqs: PublicFaq[];
  testimonials: PublicTestimonial[];
  navigation: PublicNavigationItem[];
  galleries: PublicGallery[];
};
