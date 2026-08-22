import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId:
      process.env.SANITY_STUDIO_PROJECT_ID ??
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
      "missing",
    dataset:
      process.env.SANITY_STUDIO_DATASET ??
      process.env.NEXT_PUBLIC_SANITY_DATASET ??
      "production",
  },
  deployment: {
    appId: "i3ky4ldedf8211d5dapzf3sy",
    autoUpdates: true,
  },
});
