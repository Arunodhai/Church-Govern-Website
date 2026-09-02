import { getCliClient } from "sanity/cli";
import { createSanitySeedDocuments } from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error("Set NEXT_PUBLIC_SITE_URL before preparing the Sanity demo.");
}

async function main() {
  const client = getCliClient({ apiVersion: "2026-08-19" });
  const pageDefaults = createSanitySeedDocuments({ siteUrl: siteUrl! })
    .filter((document) => document._type === "page")
    .map((document) => ({ _id: document._id, hero: document.hero, seo: document.seo }));
  let transaction = client.transaction();

  for (const page of pageDefaults) {
    transaction = transaction.patch(page._id, (patch) => patch.setIfMissing({ hero: page.hero, seo: page.seo }));
  }

  await transaction.commit({ visibility: "async" });
  console.log(`Filled missing demo fields on up to ${pageDefaults.length} Sanity pages without replacing existing values.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Sanity demo preparation failed.");
  process.exitCode = 1;
});
