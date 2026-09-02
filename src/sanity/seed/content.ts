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
  { slug: "home", pageKind: "home", title: "Home", heading: "More time for people. Less time on paperwork.", summary: "Church Govern brings administration, records and member services into one clear digital environment.", metaTitle: "Church administration, thoughtfully connected", metaDescription: "Church Govern connects church administration, trusted records and member services in one digital platform." },
  { slug: "about", pageKind: "about", title: "About Church Govern", heading: "Technology should strengthen the work that already matters.", summary: "A dependable digital foundation shaped around community, continuity and responsible stewardship.", metaTitle: "About Church Govern", metaDescription: "Learn why Church Govern is being shaped around careful administration, community and responsible stewardship." },
  { slug: "product", pageKind: "product", title: "Product", heading: "One connected foundation. Two focused experiences.", summary: "A coherent administration experience for church teams and a considered service experience for members.", metaTitle: "Church Govern product", metaDescription: "Explore the Office Suite, Member Suite and Church Govern product modules." },
  { slug: "blogs", pageKind: "blogs", title: "Blogs", heading: "Practical ideas for churches navigating digital change.", summary: "Considered guidance on administration, governance, records, technology and member engagement.", metaTitle: "Church Govern insights", metaDescription: "Practical thinking on church administration, technology, governance and records." },
  { slug: "faq", pageKind: "faq", title: "Frequently asked questions", heading: "Clear answers for an important decision.", summary: "Start with common questions about the product, implementation, digitization and support.", metaTitle: "Church Govern FAQ", metaDescription: "Answers about Church Govern, implementation, security, digitization and support." },
  { slug: "contact", pageKind: "contact", title: "Contact", heading: "Start with your church, not a sales script.", summary: "Choose the conversation that best fits your need. The details are used only to prepare and respond.", metaTitle: "Contact Church Govern", metaDescription: "Request a Church Govern demonstration, digitization assessment or general conversation." },
  { slug: "security-compliance", pageKind: "security-compliance", title: "Security and compliance", heading: "Trust begins with clear responsibility.", summary: "Technical safeguards need accountable access, transparent practices and deliberate data stewardship.", metaTitle: "Security and compliance", metaDescription: "The security, privacy and governance principles intended for Church Govern.", noIndex: true },
] as const;

export function createSanitySeedDocuments({ siteUrl }: SeedOptions): SanitySeedDocument[] {
  const parsedSiteUrl = new URL(siteUrl);
  if (parsedSiteUrl.protocol !== "https:" && parsedSiteUrl.hostname !== "localhost") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside localhost.");
  }

  const categories = [...new Set(blogPosts.map((post) => post.category))];

  return [
    ...pageDefinitions.map((page) => ({
      _id: `page-${page.slug}`,
      _type: "page",
      title: page.title,
      slug: { _type: "slug", current: page.slug },
      pageKind: page.pageKind,
      hero: {
        _type: "hero",
        heading: page.heading,
        summary: page.summary,
      },
      seo: {
        _type: "seo",
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        noIndex: "noIndex" in page ? page.noIndex : false,
      },
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
