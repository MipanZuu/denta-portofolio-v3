import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlobalPlanetField } from "@/components/layout/global-planet-field";
import { EasterEgg } from "@/components/layout/easter-egg";
import { RouteExperience } from "@/components/layout/route-experience";
import { RouteTransitionLoader } from "@/components/layout/route-transition-loader";
import { PortfolioCompanion } from "@/components/layout/portfolio-companion";
import { JsonLd } from "@/components/seo/json-ld";
import { rootJsonLd, seo } from "@/statics/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: seo.title,
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
        width: 800,
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="dark-portfolio" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("portfolio-theme");document.body.classList.toggle("dark-portfolio",t!=="light");document.documentElement.style.colorScheme=t==="light"?"light":"dark"}catch(e){document.documentElement.style.colorScheme="dark"}`,
          }}
        />
        <GlobalPlanetField />
        <JsonLd data={rootJsonLd} />
        <RouteTransitionLoader />
        <RouteExperience />
        <EasterEgg />
        <Header />
        {children}
        <Footer />
        <PortfolioCompanion />
        <Analytics />
      </body>
    </html>
  );
}
