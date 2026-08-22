import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings", "footerSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Church Govern content")
    .items([
      S.listItem().title("Site settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Footer settings").child(S.document().schemaType("footerSettings").documentId("footerSettings")),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.listItem()
        .title("Products")
        .child(S.list().title("Products").items([S.documentTypeListItem("productSuite").title("Suites"), S.documentTypeListItem("productModule").title("Modules")])),
      S.listItem()
        .title("Blog")
        .child(S.list().title("Blog").items([S.documentTypeListItem("blogPost").title("Posts"), S.documentTypeListItem("blogCategory").title("Categories"), S.documentTypeListItem("blogTag").title("Tags")])),
      S.documentTypeListItem("faq").title("FAQs"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("gallery").title("Galleries"),
      S.documentTypeListItem("navigation").title("Navigation"),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id && !singletonTypes.has(id) && !["page", "productSuite", "productModule", "blogPost", "blogCategory", "blogTag", "faq", "testimonial", "gallery", "navigation"].includes(id);
      }),
    ]);
