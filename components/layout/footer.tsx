import Link from "next/link";
import { contact } from "@/statics/contact";
import { personal } from "@/statics/personal";

export function Footer() {
  return <footer className="site-footer page-shell">
    <Link href="/" className="footer-brand"><strong>{personal.name}</strong><span>Full-stack developer</span></Link>
    <div className="footer-socials">{contact.socials.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>)}</div>
    <p>© {new Date().getFullYear()} Denta Bramasta.<br/>Designed &amp; built with care.</p>
  </footer>;
}
