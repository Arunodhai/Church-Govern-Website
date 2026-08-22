# Content, scope, and placeholder policy

## Delivery scope

### Required launch application

- Home, About, Product, approved module-detail pages, Blogs, FAQ, and the defined Contact experience.
- Responsive public navigation and footer.
- CMS-managed pages, blogs, FAQ, testimonials/media where approved, navigation/footer, and SEO fields.
- Blog listing/detail, category filtering, and blog search.
- Blog comments and ratings with moderation, anti-abuse controls, privacy, and retention behavior.
- Topic suggestions with an administrator review/moderation queue.
- Demo and digitization enquiry forms with secure persistence and operational notification.
- Essential technical SEO, analytics conversion events, HTTPS, accessibility checks, backups, and monitoring.
- A role-protected custom analytics dashboard for page views, leads, blog performance, and search terms with agreed data sources and privacy-safe aggregation.
- Managed image gallery/lightbox behavior and the approved rotating-image or cinematic-video hero treatment.
- All 17 listed Office Suite and Member Suite module pages, populated with the required sections and approved screenshots.

### Future enhancements

Customer portal, interactive product tour, video library, knowledge base, download center, webinar registration, customer stories, chatbot, newsletter, and community forum.

The complete requirements are the agreed launch scope. Individual behavior and external ownership questions still require answers, but required features must not be silently downgraded or deferred. Architecture should leave extension points for future features without pretending they exist.

## Placeholder classifications

- **Approved:** supplied or explicitly signed off by the responsible owner; eligible for production.
- **Provisional:** accurate enough for layout/review but awaiting approval; staging only and clearly tracked.
- **Structural placeholder:** synthetic label, gray box, or neutral copy used solely to build layout; never production.
- **Prohibited fabrication:** invented testimonial, person, church, product screenshot, client logo, compliance/security assurance, metric, price, company history, or legal text.

Every CMS record intended for launch should have an approval status or appear in a release content inventory owned outside source code. Production must not silently replace missing content with invented copy.

## Launch content inventory

The content owner must supply or approve:

- Church Govern and FamilyaConnect logos, color/type guidance, favicon, and social preview image.
- Final navigation/sitemap, including Contact and Security/Compliance placement.
- Company introduction, mission, vision, experience claims, and approved external product links.
- Module names, descriptions, benefits, workflows, related modules, FAQs, and screenshots for each included module page.
- Testimonials, names, roles, church affiliations, images, and documented permission to publish.
- Licensed church/community photography or video and required attribution.
- Blog posts, authorship, categories/tags, thumbnails, and definitions for recent/popular posts.
- FAQ answers, including pricing responses if Pricing remains a category.
- Form consent notices, privacy policy, terms/cookie policy as applicable, and retention wording.
- Approved product security, hosting, backup, DPDP, and GDPR statements.

## Editorial rules

- Published pages have one clear H1, a stable SEO-friendly slug, unique metadata, canonical URL, social metadata, and useful internal links.
- Images have accurate alternative text unless explicitly decorative.
- Blog limits from the requirements are at most 2,000 words, at most two inline images, and one thumbnail; exact minimum/required-image behavior still needs client confirmation.
- Draft/unpublished content does not appear in public routes, search, sitemap, related content, or analytics reports.
- Slug changes require redirects where the previous URL was public.

## Unresolved content decisions

Track final answers in [decisions.md](decisions.md): Contact-page behavior, separate Security/Compliance routes versus Product sections, dynamic latest blogs versus curated blogs, image versus video hero, gallery placement, search scope, FAQ filtering, internationalization, denomination-sensitive language, comments/ratings identity and moderation behavior, analytics data sources, and definitions for “popular” content.
