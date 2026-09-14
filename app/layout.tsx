import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Denta Bramasta — Full-stack Developer",
  description: "Portfolio of Denta Bramasta Hidayat, a full-stack developer and creative technologist building thoughtful digital products.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body><Header />{children}<Footer /></body></html>;
}
