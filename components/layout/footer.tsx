import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FooterParticleMark } from "@/components/layout/footer-particle-mark";
import { contact } from "@/statics/contact";
import { personal } from "@/statics/personal";

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-nebula" aria-hidden="true" />
    <div className="footer-inner page-shell">
      <div className="footer-cta">
        <p>Every useful product starts<br />with a question worth following.</p>
        <Link href="/contact">Start a conversation <ArrowUpRight aria-hidden="true" /></Link>
      </div>

      <div className="footer-directory">
        <Link href="/" className="footer-brand"><strong>MZ</strong><span>{personal.role}</span><small>Building calm products with a little cosmic dust.</small></Link>
        <nav aria-label="Footer navigation">
          <span>Navigate</span>
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/journey">Journey</Link>
          <Link href="/playground">Playground</Link>
        </nav>
        <div className="footer-contact">
          <span>Find me</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <div className="footer-socials">{contact.socials.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>)}</div>
        </div>
      </div>

      <FooterParticleMark />
      <div className="footer-legal"><span>© {new Date().getFullYear()} Denta Bramasta</span><span>Designed &amp; built in my orbit</span></div>
    </div>
  </footer>;
}
