import { blogPosts, faqs, modules, navItems } from "@/content/site";
import { isMockContentMode } from "@/lib/demo-mode";
import type {
  PublicBlogPost,
  PublicFaq,
  PublicGallery,
  PublicModule,
  PublicNavigationItem,
  PublicPage,
  PublicTestimonial,
} from "./types";

export function shouldUseMockContent(
  nodeEnv = process.env.NODE_ENV,
  flag = process.env.USE_MOCK_CONTENT,
  appEnv = process.env.APP_ENV,
  vercelEnv = process.env.VERCEL_ENV,
) {
  return isMockContentMode(nodeEnv, flag, appEnv, vercelEnv);
}

const pageContent: Record<string, Omit<PublicPage, "id" | "slug">> = {
  home: {
    title: "More time for people. Less time on paperwork.",
    excerpt: "Church Govern brings administration, records and member services into one clear digital environment.",
    blocks: [
      { eyebrow: "Demo content", heading: "A connected starting point", body: "This development-only section demonstrates the structured page experience while the client reviews final copy and assets.\n\nReplace it with approved Sanity content before production." },
    ],
    seo: { title: "Church administration, thoughtfully connected", description: "Development mock content for the Church Govern website." },
  },
  about: {
    title: "Technology should strengthen the work that already matters.",
    excerpt: "A dependable digital foundation shaped around community, continuity and responsible stewardship.",
    blocks: [{ eyebrow: "Mock CMS section", heading: "Why Church Govern", body: "Churches coordinate people, records and recurring work across generations. This mock content exercises the editable page-section presentation while final corporate copy is pending." }],
    seo: { title: "About Church Govern", description: "Development mock content for the Church Govern About page." },
  },
  product: {
    title: "One connected foundation. Two focused experiences.",
    excerpt: "A coherent administration experience for church teams and a considered service experience for members.",
    blocks: [{ eyebrow: "Mock CMS section", heading: "Designed to work together", body: "The Office and Member suites use shared information and focused permissions. All 17 source modules are available below for local testing." }],
    seo: { title: "Church Govern product", description: "Explore development mock data for all Church Govern modules." },
  },
  blogs: {
    title: "Practical ideas for churches navigating digital change.",
    excerpt: "Considered guidance on administration, governance, records, technology and member engagement.",
    blocks: [{ eyebrow: "Demo content", heading: "Editorial workspace preview", body: "Six provisional articles demonstrate search, category filtering, article details, ratings and moderated comments. Matching provisional records are also available in the connected Sanity Studio." }],
    seo: { title: "Church Govern insights", description: "Development mock editorial content." },
  },
  faq: {
    title: "Clear answers for an important decision.",
    excerpt: "Start with common questions about the product, implementation, digitization and support.",
    blocks: [{ eyebrow: "Mock CMS section", heading: "Testing the FAQ workspace", body: "Ten source FAQs are loaded below. Their wording remains provisional until the client approves it in Sanity." }],
    seo: { title: "Church Govern FAQ", description: "Development mock FAQ content." },
  },
  contact: {
    title: "Start with your church, not a sales script.",
    excerpt: "Choose the conversation that best fits your need. The details are used only to prepare and respond.",
    blocks: [{ eyebrow: "Demo content", heading: "Every enquiry path is ready to review", body: "Demo, digitization and contact forms can be completed in local demo mode. Submissions return realistic confirmation states but are deliberately not stored or emailed." }],
    seo: { title: "Contact Church Govern", description: "Development mock Contact-page content." },
  },
  "security-compliance": {
    title: "Trust begins with clear responsibility.",
    excerpt: "Technical safeguards need accountable access, transparent practices and deliberate data stewardship.",
    blocks: [{ eyebrow: "Mock CMS section", heading: "No certification is being claimed", body: "This development content demonstrates the trust-page CMS fields. Final security, privacy and compliance language requires technical and legal approval." }],
    seo: { title: "Security and compliance", description: "Development mock trust content.", noindex: true },
  },
};

export const mockPages: PublicPage[] = Object.entries(pageContent).map(([slug, page]) => ({ id: `mock-page-${slug}`, slug, ...page }));

export const mockModules: PublicModule[] = modules.map((item) => ({
  ...item,
  id: `mock-module-${item.slug}`,
  seo: { title: `${item.name} | Church Govern`, description: item.summary },
  screenshots: [
    { id: `mock-${item.slug}-overview`, url: "/images/demo/module-overview.svg", alt: `Illustrative mock overview screen for ${item.name}`, caption: `${item.name} demo UI concept — not a product screenshot`, width: 1600, height: 1000 },
    { id: `mock-${item.slug}-workflow`, url: "/images/demo/module-workflow.svg", alt: `Illustrative mock workflow screen for ${item.name}`, caption: `${item.name} workflow concept — replace with approved product media`, width: 1600, height: 1000 },
  ],
}));

export const mockBlogs: PublicBlogPost[] = blogPosts.map((item, index) => ({
  ...item,
  id: `mock-blog-${item.slug}`,
  seo: { title: item.title, description: item.summary },
  tags: ["Mock content", item.category],
  media: {
    id: `mock-blog-image-${index + 1}`,
    url: index % 2 === 0 ? "/images/records-digitization.jpg" : "/images/church-community-hero.jpg",
    alt: index % 2 === 0 ? "Development mock thumbnail showing historical records" : "Development mock thumbnail showing a church community",
    caption: "Development mock thumbnail — replace before production",
  },
  rating: { average: 4.2 + (index % 4) * 0.2, count: 9 + index * 3 },
}));

const globalMockFaqs: PublicFaq[] = faqs.map((item, index) => ({ id: `mock-faq-${index + 1}`, ...item }));

const moduleMockFaqs: PublicFaq[] = modules.flatMap((item) => [
  {
    id: `mock-faq-${item.slug}-purpose`,
    category: "Product",
    moduleSlug: item.slug,
    question: `What does ${item.name} help a church do?`,
    answer: `${item.name} is represented in this demo as a focused part of the ${item.suite.toLowerCase()}. Final behavior, terminology and permissions will be confirmed with the product owner before production.`,
  },
  {
    id: `mock-faq-${item.slug}-implementation`,
    category: "Implementation",
    moduleSlug: item.slug,
    question: `How would ${item.name} be introduced?`,
    answer: "The demo uses a phased path: confirm the church workflow, agree roles and information fields, review representative data, validate the configured process and then plan controlled adoption.",
  },
]);

export const mockFaqs: PublicFaq[] = [...globalMockFaqs, ...moduleMockFaqs];

export const mockNavigation: PublicNavigationItem[] = navItems.map((item, index) => ({
  id: `mock-nav-${index + 1}`,
  ...item,
  location: "header",
  external: false,
  children: [],
}));

export const mockTestimonials: PublicTestimonial[] = [
  {
    id: "mock-testimonial-1",
    name: "Sample administrator (mock)",
    churchName: "Sample church — development data",
    designation: "Office administrator",
    quote: "This clearly labelled mock testimonial exists only to test the layout. It is not a customer endorsement.",
  },
  {
    id: "mock-testimonial-2",
    name: "Sample clergy member (mock)",
    churchName: "Sample parish — development data",
    designation: "Parish team",
    quote: "Replace this development-only quotation with a consented, client-supplied testimonial before launch.",
  },
];

export const mockGalleries: PublicGallery[] = [
  {
    id: "mock-gallery-community",
    slug: "community-preview",
    name: "Development gallery preview",
    description: "Mock assets used to test responsive images and the lightbox. These are not product screenshots.",
    items: [
      { id: "mock-gallery-1", url: "/images/church-community-hero.jpg", alt: "Mock church community gallery image", caption: "Development mock image" },
      { id: "mock-gallery-2", url: "/images/records-digitization.jpg", alt: "Mock records digitization gallery image", caption: "Development mock image" },
    ],
  },
];
