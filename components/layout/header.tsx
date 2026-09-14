"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contact } from "@/statics/contact";
import { navigation } from "@/statics/navigation";

type IconProps = { className?: string };

function RouteIcon({ route, className }: IconProps & { route: string }) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (route === "about") return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><circle cx="12" cy="12" r="9"/><path d="M12 10v6m0-9h.01"/></svg>;
  if (route === "technologies") return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8m-4-3v3"/></svg>;
  if (route === "projects" || route === "experience") return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="M4 5h16v15H4zM8 5V3h8v2M8 10h8m-8 4h5"/></svg>;
  if (route === "blog") return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h5"/></svg>;
  if (route === "contact") return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>;
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4z"/></svg>;
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.5 8.3H3.2V19h3.3V8.3ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3Zm14.4 9.9c0-3.2-1.7-4.8-4-4.8-1.9 0-2.7 1-3.2 1.8V8.3H8.7V19H12v-5.3c0-1.4.3-2.8 2.1-2.8 1.8 0 1.8 1.7 1.8 2.9V19h3.3v-6.1Z"/></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.3-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const active = pathname === "/" ? "home" : pathname.split("/")[1];
  const activeLabel = navigation.find((item) => item.section === active)?.label ?? "Home";
  const primaryNavigation = navigation.filter((item) => ["home", "about", "projects"].includes(item.section));
  const moreNavigation = navigation.filter((item) => ["experience", "technologies", "blog"].includes(item.section));

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsidePress);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsidePress);
    };
  }, []);

  const toggleTheme = () => {
    setDark((current) => {
      document.body.classList.toggle("dark-portfolio", !current);
      return !current;
    });
  };

  return <header ref={headerRef} className={`dynamic-header ${open ? "is-expanded" : ""}`}>
    <div className="apple-nav-bar">
      <Link className="apple-brand" href="/" aria-label="Denta Bramasta, home" onClick={() => setOpen(false)}><Image src="/images/logo.png" alt="" width={94} height={48} priority /></Link>
      <span className="apple-mobile-label"><RouteIcon route={active} />{activeLabel}</span>
      <nav className="apple-primary-nav" aria-label="Primary navigation">
        {primaryNavigation.map((item) => <Link className={active === item.section ? "is-active" : ""} key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
      </nav>
      <span className="apple-nav-separator" aria-hidden="true" />
      <button className="apple-more-button" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="more-navigation">
        More <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 10 4-4 4 4" /></svg>
      </button>
    </div>

    <div className="apple-mega-menu" id="more-navigation" aria-hidden={!open}>
      <div className="apple-mega-heading"><div><span>Explore more</span><strong>The rest of my portfolio</strong></div><button type="button" onClick={() => setOpen(false)} aria-label="Close expanded navigation">×</button></div>
      <div className="apple-mega-grid">
        {moreNavigation.map((item) => <Link className={`apple-mega-card ${active === item.section ? "is-active" : ""}`} href={item.href} key={item.href} onClick={() => setOpen(false)}>
          <span className="apple-mega-icon"><RouteIcon route={item.section} /></span>
          <span><strong>{item.label}</strong><small>{item.section === "experience" ? "Roles, impact, and the journey so far" : item.section === "blog" ? "Notes on engineering, products, and craft" : "Languages, frameworks, and everyday tools"}</small></span>
          <b aria-hidden="true">↗</b>
        </Link>)}
        <Link className={`apple-mega-card ${active === "contact" ? "is-active" : ""}`} href="/contact" onClick={() => setOpen(false)}>
          <span className="apple-mega-icon"><RouteIcon route="contact" /></span>
          <span><strong>Contact</strong><small>Start a conversation or collaboration</small></span>
          <b aria-hidden="true">↗</b>
        </Link>
      </div>
      <div className="apple-quick-actions">
        <span>Quick actions</span>
        <a href={contact.socials[0].href} target="_blank" rel="noreferrer"><LinkedInIcon />LinkedIn</a>
        <a href={contact.socials[1].href} target="_blank" rel="noreferrer"><GitHubIcon />GitHub</a>
        <a href="/documents/denta-bramasta-cv.pdf" target="_blank" rel="noreferrer"><span className="apple-file-icon">↓</span>Résumé</a>
        <button type="button" onClick={toggleTheme}><span>{dark ? "☀" : "☾"}</span>{dark ? "Light mode" : "Dark mode"}</button>
      </div>
    </div>
  </header>;
}
