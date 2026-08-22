import { blogPosts, faqs, modules, navItems } from "../../content/site";

/** Source-to-Sanity migration dataset. All editorial records remain provisional. */
export type SanitySeedDocument = Record<string, unknown> & { _id: string; _type: string };

type SeedOptions = { siteUrl: string };

const asSlug = (value: string) =>
  value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const textBlock = (text: string, key: string, style = "normal") => ({
  _key: key,
  _type: "block",
  style,
  markDefs: [],
  children: [{ _key: `${key}-span`, _type: "span", marks: [], text }],
});

const pageDefinitions = [
  ["home", "Home", "home"],
  ["about", "About Church Govern", "about"],
  ["product", "Product", "product"],
  ["blogs", "Blogs", "blogs"],
  ["faq", "Frequently asked questions", "faq"],
  ["contact", "Contact", "contact"],
  ["security-compliance", "Security and compliance", "security-compliance"],
] as const;

export function createSanitySeedDocuments({ siteUrl }: SeedOptions): SanitySeedDocument[] {
  const parsedSiteUrl = new URL(siteUrl);
  if (parsedSiteUrl.protocol !== "https:" && parsedSiteUrl.hostname !== "localhost") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside localhost.");
  }

  const categories = [...new Set(blogPosts.map((post) => post.category))];

  return [
    ...pageDefinitions.map(([slug, title, pageKind]) => ({
      _id: `page-${slug}`,
      _type: "page",
      title,
      slug: { _type: "slug", current: slug },
      pageKind,
      contentStatus: "provisional",
    })),
    {
      _id: "suite-office",
      _type: "productSuite",
      title: "Office Suite",
      slug: { _type: "slug", current: "office-suite" },
      summary: "Church administration modules for authorized office teams.",
      order: 1,
      contentStatus: "provisional",
    },
    {
      _id: "suite-member",
      _type: "productSuite",
      title: "Member Suite",
      slug: { _type: "slug", current: "member-suite" },
      summary: "Member-facing modules enabled by each church.",
      order: 2,
      contentStatus: "provisional",
    },
    ...modules.map((module, index) => ({
      _id: `module-${module.slug}`,
      _type: "productModule",
      name: module.name,
      slug: { _type: "slug", current: module.slug },
      suite: { _type: "reference", _ref: module.suite === "Member suite" ? "suite-member" : "suite-office" },
      eyebrow: module.eyebrow,
      summary: module.summary,
      overview: [textBlock(module.overview, `${module.slug}-overview`)],
      benefits: module.benefits,
      features: module.features,
      workflow: module.workflow,
      relatedModules: module.related.map((slug) => ({ _key: `related-${slug}`, _type: "reference", _ref: `module-${slug}` })),
      order: index + 1,
      contentStatus: "provisional",
    })),
    ...categories.map((title) => ({
      _id: `blog-category-${asSlug(title)}`,
      _type: "blogCategory",
      title,
      slug: { _type: "slug", current: asSlug(title) },
    })),
    ...blogPosts.map((post) => ({
      _id: `blog-${post.slug}`,
      _type: "blogPost",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.summary,
      authorName: post.author,
      publishedAt: `${post.date}T00:00:00.000Z`,
      category: { _type: "reference", _ref: `blog-category-${asSlug(post.category)}` },
      body: post.sections.flatMap((section, sectionIndex) => [
        textBlock(section.heading, `${post.slug}-heading-${sectionIndex + 1}`, "h2"),
        ...section.paragraphs.map((paragraph, paragraphIndex) =>
          textBlock(paragraph, `${post.slug}-paragraph-${sectionIndex + 1}-${paragraphIndex + 1}`),
        ),
      ]),
      featured: Boolean(post.popular),
      popular: Boolean(post.popular),
      contentStatus: "provisional",
    })),
    ...faqs.map((item, index) => ({
      _id: `faq-${index + 1}`,
      _type: "faq",
      question: item.question,
      answer: item.answer,
      category: item.category,
      order: index + 1,
      contentStatus: "provisional",
    })),
    {
      _id: "navigation-header",
      _type: "navigation",
      title: "Primary navigation",
      location: "header",
      items: navItems.map((item, index) => ({
        _key: `nav-${index + 1}`,
        _type: "navigationItem",
        label: item.label,
        internalPath: item.href,
        openInNewTab: false,
      })),
    },
    {
      _id: "siteSettings",
      _type: "siteSettings",
      title: "Church Govern",
      organizationName: "Church Govern",
      siteUrl: parsedSiteUrl.toString().replace(/\/$/, ""),
      description: "Church Govern website content. Final public description requires client approval.",
    },
    {
      _id: "footerSettings",
      _type: "footerSettings",
      heading: "Church Govern",
      summary: "Final footer content requires client approval.",
    },
  ];
}
