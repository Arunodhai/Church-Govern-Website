import type { Metadata } from "next";
import { siteUrl } from "@/components/seo/metadata";
import { resolveAppEnvironment } from "@/lib/demo-mode";
import "./globals.css";

const isProduction = resolveAppEnvironment() === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Church Govern | Church administration, thoughtfully connected",
    template: "%s | Church Govern",
  },
  description: "A secure, connected platform designed to simplify church administration, support clergy and strengthen member engagement.",
  applicationName: "Church Govern",
  keywords: ["church administration", "church management software", "church records", "member engagement"],
  openGraph: {
    type: "website",
    siteName: "Church Govern",
    title: "Church Govern",
    description: "Church administration, thoughtfully connected.",
  },
  robots: { index: isProduction, follow: isProduction },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
