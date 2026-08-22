import { notFound, redirect } from "next/navigation";

const sanityCollections = new Set(["pages", "modules", "blogs", "faqs", "testimonials", "navigation", "media"]);

export default async function RetiredContentEditor({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (sanityCollections.has(collection)) redirect("/studio");
  notFound();
}
