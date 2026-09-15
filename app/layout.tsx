import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RouteTransitionLoader } from "@/components/layout/route-transition-loader";
import { JsonLd } from "@/components/seo/json-ld";
import { personJsonLd, seo, websiteJsonLd } from "@/statics/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: { default: seo.title, template: "%s — Denta Bramasta" },
  description: seo.description,
  applicationName: seo.siteName,
  authors: [{ name: "Denta Bramasta Hidayat", url: seo.siteUrl }],
  creator: "Denta Bramasta Hidayat",
  publisher: "Denta Bramasta Hidayat",
  keywords: [...seo.keywords],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: seo.siteName,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: "/images/profile.jpg",
        width: 1200,
        height: 1200,
        alt: "Denta Bramasta Hidayat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/images/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <JsonLd data={[websiteJsonLd, personJsonLd]} />
        <RouteTransitionLoader />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
