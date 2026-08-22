import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Church Govern",
    short_name: "Church Govern",
    description: "Church administration, thoughtfully connected.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f1e8",
    theme_color: "#123f35",
  };
}
