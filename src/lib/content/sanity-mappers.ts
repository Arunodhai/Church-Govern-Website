import type {
  PublicBlogPost,
  PublicFaq,
  PublicGallery,
  PublicMedia,
  PublicModule,
  PublicNavigationItem,
  PublicPage,
  PublicSeo,
  PublicTestimonial,
} from "./types";

export type SanityRecord = Record<string, unknown>;

function record(value: unknown): SanityRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as SanityRecord : {};
}

function records(value: unknown): SanityRecord[] {
  return Array.isArray(value) ? value.map(record).filter((item) => Object.keys(item).length > 0) : [];
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function texts(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function portableTextToPlainText(value: unknown): string {
  return records(value)
    .filter((block) => block._type === "block")
    .map((block) => records(block.children).map((child) => text(child.text)).join(""))
    .filter(Boolean)
    .join("\n\n");
}

function portableTextToSections(value: unknown) {
  const sections: { heading: string; paragraphs: string[] }[] = [];
  let current = { heading: "Overview", paragraphs: [] as string[] };

  for (const block of records(value)) {
    if (block._type !== "block") continue;
    const valueText = records(block.children).map((child) => text(child.text)).join("").trim();
    if (!valueText) continue;
    if (block.style === "h2" || block.style === "h3") {
      if (current.paragraphs.length) sections.push(current);
      current = { heading: valueText, paragraphs: [] };
    } else {
      current.paragraphs.push(valueText);
    }
  }

  if (current.paragraphs.length || (current.heading !== "Overview" && sections.length === 0)) sections.push(current);
  return sections;
}

export function mapSanityImage(value: unknown): PublicMedia | undefined {
  const image = record(value);
  const asset = record(image.asset);
  const url = text(asset.url);
  if (!url) return undefined;
  const dimensions = record(record(asset.metadata).dimensions);
  return {
    id: text(asset._id || asset._ref, url),
    url,
    alt: text(image.alt),
    caption: text(image.caption) || undefined,
    width: typeof dimensions.width === "number" ? dimensions.width : undefined,
    height: typeof dimensions.height === "number" ? dimensions.height : undefined,
  };
}

export function mapSanitySeo(value: unknown): PublicSeo {
  const seo = record(value);
  return {
    title: text(seo.metaTitle) || undefined,
    description: text(seo.metaDescription) || undefined,
    canonicalUrl: text(seo.canonicalUrl) || undefined,
    noindex: typeof seo.noIndex === "boolean" ? seo.noIndex : undefined,
    imageUrl: mapSanityImage(seo.openGraphImage)?.url,
    keywords: texts(seo.keywords),
  };
}

export function mapSanityPage(value: unknown): PublicPage {
  const page = record(value);
  const hero = record(page.hero);
  return {
    id: text(page._id),
    slug: text(page.slug),
    title: text(hero.heading, text(page.title)),
    excerpt: text(hero.summary),
    blocks: records(page.sections).filter((section) => section._type !== "callToAction").map((section) => ({
      heading: text(section.heading),
      eyebrow: text(section.eyebrow) || undefined,
      body: portableTextToPlainText(section.body),
      image: mapSanityImage(section.image),
    })),
    seo: mapSanitySeo(page.seo),
  };
}

export function mapSanityModule(value: unknown): PublicModule {
  const moduleRecord = record(value);
  const suite = record(moduleRecord.suite);
  const suiteSlug = text(suite.slug);
  return {
    id: text(moduleRecord._id),
    slug: text(moduleRecord.slug),
    name: text(moduleRecord.name),
    suite: suiteSlug === "member-suite" ? "Member suite" : "Office suite",
    eyebrow: text(moduleRecord.eyebrow),
    summary: text(moduleRecord.summary),
    overview: portableTextToPlainText(moduleRecord.overview),
    benefits: texts(moduleRecord.benefits),
    features: texts(moduleRecord.features),
    workflow: texts(moduleRecord.workflow),
    related: records(moduleRecord.relatedModules).map((item) => text(item.slug)).filter(Boolean),
    seo: mapSanitySeo(moduleRecord.seo),
    media: mapSanityImage(records(moduleRecord.gallery)[0]),
    screenshots: records(moduleRecord.gallery).map(mapSanityImage).filter((item): item is PublicMedia => Boolean(item)),
  };
}

export function mapSanityBlogPost(value: unknown): PublicBlogPost {
  const post = record(value);
  const bodyText = portableTextToPlainText(post.body);
  return {
    id: text(post._id),
    slug: text(post.slug),
    title: text(post.title),
    summary: text(post.excerpt),
    category: text(record(post.category).title, "Insights"),
    date: text(post.publishedAt).slice(0, 10),
    readTime: `${Math.max(1, Math.ceil(bodyText.split(/\s+/).filter(Boolean).length / 220))} min read`,
    author: text(post.authorName),
    popular: post.popular === true,
    sections: portableTextToSections(post.body),
    seo: mapSanitySeo(post.seo),
    tags: records(post.tags).map((tag) => text(tag.title)).filter(Boolean),
    media: mapSanityImage(post.thumbnail),
  };
}

export function mapSanityFaq(value: unknown): PublicFaq {
  const faq = record(value);
  return { id: text(faq._id), category: text(faq.category), question: text(faq.question), answer: text(faq.answer) };
}

export function mapSanityTestimonial(value: unknown): PublicTestimonial {
  const item = record(value);
  return {
    id: text(item._id),
    name: text(item.personName),
    churchName: text(item.organization),
    designation: text(item.role) || undefined,
    quote: text(item.quote),
    image: mapSanityImage(item.portrait),
  };
}

function mapLink(value: unknown, location: PublicNavigationItem["location"], index: number): PublicNavigationItem {
  const item = record(value);
  const href = text(item.internalPath) || text(item.externalUrl);
  return {
    id: text(item._key, `${location}-${index}`),
    href,
    label: text(item.label),
    location,
    external: Boolean(item.externalUrl),
    children: records(item.children).map((child, childIndex) => mapLink(child, location, childIndex)),
  };
}

export function mapSanityNavigation(value: unknown, requestedLocation: PublicNavigationItem["location"]): PublicNavigationItem[] {
  return records(record(value).items).map((item, index) => mapLink(item, requestedLocation, index));
}

export function mapSanityGallery(value: unknown): PublicGallery {
  const gallery = record(value);
  return {
    id: text(gallery._id),
    slug: text(gallery.slug),
    name: text(gallery.title),
    description: text(gallery.description) || undefined,
    items: records(gallery.images).map(mapSanityImage).filter((item): item is PublicMedia => Boolean(item)),
  };
}
