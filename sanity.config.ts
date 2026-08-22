"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityEnv } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "church-govern",
  title: "Church Govern",
  basePath: "/studio",
  // Valid non-secret placeholders keep local builds deterministic until SBL creates the project.
  // The /studio route is guarded and will not mount Studio while these values are absent.
  projectId: sanityEnv.projectId ?? "missing",
  dataset: sanityEnv.dataset ?? "production",
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: sanityEnv.apiVersion })],
  schema: { types: schemaTypes },
});
