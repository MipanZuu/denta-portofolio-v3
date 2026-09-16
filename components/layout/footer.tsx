import Link from "next/link";
import { Orbit } from "lucide-react";
import { FooterParticleMark } from "@/components/layout/footer-particle-mark";
import { contact } from "@/statics/contact";
import { personal } from "@/statics/personal";

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-nebula" aria-hidden="true" />
    <div className="footer-inner page-shell">
      <div className="footer-directory">
        <Link href="/" className="footer-brand">
          <span className="footer-orbit-icon"><Orbit aria-hidden="true" /></span>
          <span><strong>MZ / HOME ORBIT</strong><small>{personal.role}<br />Building calm products with a little cosmic dust.</small></span>
        </Link>
        <div className="footer-link-station">
          <nav aria-label="Footer navigation">
            <span>Explore</span>
            <div><Link href="/about">About</Link><Link href="/projects">Projects</Link><Link href="/journey">Journey</Link><Link href="/playground">Playground</Link></div>
          </nav>
          <div className="footer-contact">
            <span>Signal</span>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <div className="footer-socials">{contact.socials.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>)}</div>
          </div>
        </div>
      </div>

      <FooterParticleMark />
      <div className="footer-legal"><span>© {new Date().getFullYear()} Denta Bramasta</span><span>Designed &amp; built in my orbit</span></div>
    </div>
  </footer>;
}
