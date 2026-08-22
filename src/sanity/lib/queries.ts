import { defineQuery } from "next-sanity";

const IMAGE_PROJECTION = `{
  ..., asset->{_id, url, metadata{dimensions, lqip, palette}}
}`;

const SEO_PROJECTION = `seo{
  metaTitle, metaDescription, canonicalUrl, noIndex, schemaType, keywords,
  openGraphImage${IMAGE_PROJECTION}
}`;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    title, organizationName, brandRelationship, siteUrl, description,
    logo${IMAGE_PROJECTION}, contactEmail, contactPhone, address,
    socialLinks[]{label, url}, analytics{ga4MeasurementId, metaPixelId},
    defaultSeo{metaTitle, metaDescription, canonicalUrl, noIndex, schemaType, keywords,
      openGraphImage${IMAGE_PROJECTION}}
  }
`);

export const NAVIGATION_QUERY = defineQuery(`
  *[_type == "navigation" && location == $location][0]{
    title, location,
    items[]{label, internalPath, externalUrl, openInNewTab,
      children[]{label, internalPath, externalUrl, openInNewTab}}
  }
`);

export const FOOTER_QUERY = defineQuery(`
  *[_type == "footerSettings"][0]{
    heading, summary, copyrightText,
    columns[]{heading, links[]{label, internalPath, externalUrl, openInNewTab}},
    legalLinks[]{label, internalPath, externalUrl, openInNewTab}
  }
`);

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug && contentStatus == "approved"][0]{
    _id, title, "slug": slug.current, pageKind, contentStatus,
    hero{eyebrow, heading, summary, image${IMAGE_PROJECTION},
      actions[]{label, internalPath, externalUrl, openInNewTab}},
    sections[]{..., image${IMAGE_PROJECTION}, gallery[]{..., asset->},
      links[]{label, internalPath, externalUrl, openInNewTab}},
    ${SEO_PROJECTION}
  }
`);

export const PRODUCT_SUITES_QUERY = defineQuery(`
  *[_type == "productSuite" && contentStatus == "approved"] | order(order asc){
    _id, title, "slug": slug.current, summary, order,
    heroImage${IMAGE_PROJECTION},
    "moduleCount": count(*[_type == "productModule" && references(^._id) && contentStatus == "approved"])
  }
`);

export const PRODUCT_MODULES_QUERY = defineQuery(`
  *[_type == "productModule" && contentStatus == "approved"] | order(order asc){
    _id, name, "slug": slug.current, eyebrow, summary, overview, benefits, features, workflow, order,
    "suite": suite->{_id, title, "slug": slug.current},
    gallery[]${IMAGE_PROJECTION},
    "relatedModules": relatedModules[]->{_id, name, "slug": slug.current},
    callToAction{heading, summary, link{label, internalPath, externalUrl, openInNewTab}},
    ${SEO_PROJECTION}
  }
`);

export const PRODUCT_SUITE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "productSuite" && slug.current == $slug && contentStatus == "approved"][0]{
    _id, title, "slug": slug.current, eyebrow, summary, body,
    heroImage${IMAGE_PROJECTION}, gallery[]${IMAGE_PROJECTION}, ${SEO_PROJECTION},
    "modules": *[_type == "productModule" && suite._ref == ^._id && contentStatus == "approved"] | order(order asc){
      _id, name, "slug": slug.current, eyebrow, summary, order
    }
  }
`);

export const PRODUCT_MODULE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "productModule" && slug.current == $slug && contentStatus == "approved"][0]{
    _id, name, "slug": slug.current, eyebrow, summary, overview, benefits, features, workflow,
    "suite": suite->{_id, title, "slug": slug.current},
    gallery[]${IMAGE_PROJECTION},
    "relatedModules": relatedModules[]->{_id, name, "slug": slug.current},
    callToAction{heading, summary, link{label, internalPath, externalUrl, openInNewTab}},
    ${SEO_PROJECTION}
  }
`);

export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && contentStatus == "approved" && defined(slug.current) && publishedAt <= now()
    && (!defined($category) || category->slug.current == $category)
    && (!defined($tag) || $tag in tags[]->slug.current)
    && (!defined($search) || title match ($search + "*") || excerpt match ($search + "*"))]
  | order(publishedAt desc)[$offset...$end]{
    _id, title, "slug": slug.current, excerpt, publishedAt, authorName, featured, popular,
    thumbnail${IMAGE_PROJECTION},
    "category": category->{title, "slug": slug.current},
    "tags": tags[]->{title, "slug": slug.current}
  }
`);

export const BLOG_POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "blogPost" && contentStatus == "approved" && slug.current == $slug && publishedAt <= now()][0]{
    _id, title, "slug": slug.current, excerpt, publishedAt, authorName, body, featured, popular,
    thumbnail${IMAGE_PROJECTION},
    "category": category->{title, "slug": slug.current},
    "tags": tags[]->{title, "slug": slug.current},
    ${SEO_PROJECTION}
  }
`);

export const RECENT_BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && contentStatus == "approved" && publishedAt <= now()] | order(publishedAt desc)[0...$limit]{
    _id, title, "slug": slug.current, excerpt, publishedAt, thumbnail${IMAGE_PROJECTION}
  }
`);

export const POPULAR_BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && contentStatus == "approved" && popular == true && publishedAt <= now()] | order(publishedAt desc)[0...$limit]{
    _id, title, "slug": slug.current, excerpt, publishedAt, thumbnail${IMAGE_PROJECTION}
  }
`);

export const BLOG_TAXONOMY_QUERY = defineQuery(`{
  "categories": *[_type == "blogCategory"] | order(title asc){title, "slug": slug.current},
  "tags": *[_type == "blogTag"] | order(title asc){title, "slug": slug.current}
}`);

export const FAQS_QUERY = defineQuery(`
  *[_type == "faq" && contentStatus == "approved"] | order(category asc, order asc){
    _id, question, answer, category, order
  }
`);

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && contentStatus == "approved" && publicationConsent == true]
  | order(order asc){
    _id, quote, personName, role, organization, order, portrait${IMAGE_PROJECTION}
  }
`);

export const GALLERY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "gallery" && slug.current == $slug && contentStatus == "approved"][0]{
    _id, title, "slug": slug.current, description, images[]${IMAGE_PROJECTION}
  }
`);

export const GALLERIES_QUERY = defineQuery(`
  *[_type == "gallery" && contentStatus == "approved"] | order(title asc){
    _id, title, "slug": slug.current, description, images[]${IMAGE_PROJECTION}
  }
`);

export const SITEMAP_QUERY = defineQuery(`{
  "pages": *[_type == "page" && contentStatus == "approved" && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "suites": *[_type == "productSuite" && contentStatus == "approved" && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "modules": *[_type == "productModule" && contentStatus == "approved" && seo.noIndex != true]{"slug": slug.current, _updatedAt},
  "posts": *[_type == "blogPost" && contentStatus == "approved" && publishedAt <= now() && seo.noIndex != true]{"slug": slug.current, _updatedAt}
}`);
