import { getCliClient } from "sanity/cli";
import { createSanitySeedDocuments } from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error("Set NEXT_PUBLIC_SITE_URL before importing the Sanity seed.");
}

async function main() {
  const client = getCliClient({ apiVersion: "2026-08-19" });
  const documents = createSanitySeedDocuments({ siteUrl: siteUrl! });
  let transaction = client.transaction();

  for (const document of documents) {
    transaction = transaction.createOrReplace(document);
  }

  await transaction.commit({ visibility: "async" });
  console.log(`Created or replaced ${documents.length} provisional Sanity documents.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Sanity seed import failed.");
  process.exitCode = 1;
});
