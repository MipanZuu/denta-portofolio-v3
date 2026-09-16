import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Page not found" },
  description: "That page is not here, but the rest of Denta Bramasta's portfolio is still within reach.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <main className="not-found-page page-shell"><section className="not-found-card">
    <div className="not-found-orbit" aria-hidden="true"><span className="not-found-orbit-ring ring-one"><i /></span><span className="not-found-orbit-ring ring-two"><i /></span><span className="not-found-orbit-core">404</span></div>
    <div className="not-found-copy"><p className="eyebrow">Lost in the portfolio</p><h1>This page drifted out of orbit.</h1><p>The link may be old, mistyped, or exploring space without permission.</p><div><Link className="button button-primary" href="/"><ArrowLeft aria-hidden="true" /> Back home</Link><Link className="button button-ghost" href="/projects"><Compass aria-hidden="true" /> Explore projects</Link></div></div>
  </section></main>;
}
