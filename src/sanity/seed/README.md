# Sanity starter content

`content.ts` maps the current source content into idempotent Sanity documents:
7 pages, 2 suites, 17 modules, 6 blog posts, their categories, 10 FAQs, header
navigation, footer settings, and site settings. Editorial records intentionally use
`contentStatus: provisional`; public GROQ queries exclude them until approved.

After SBL creates and owns the Sanity project, set `NEXT_PUBLIC_SITE_URL` and run:

```bash
npx sanity exec src/sanity/seed/import.ts --with-user-token
```

`import.ts` uses one transaction and `createOrReplace`, so rerunning it is
idempotent. Keep every write token server-side; never put one in a
`NEXT_PUBLIC_` variable or commit it.

Blog thumbnails are intentionally absent because no approved source images exist.
Studio validation requires an editor to add exactly one thumbnail before approval.

No testimonial, legal claim, compliance guarantee, organization history, product
screenshot, or analytics identifier is included in this starter set.
