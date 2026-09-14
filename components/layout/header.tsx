"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contact } from "@/statics/contact";
import { navigation } from "@/statics/navigation";

type IconProps = { className?: string };

function RouteIcon({ route, className }: IconProps & { route: string }) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (route === "about") return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><circle cx="12" cy="12" r="9"/><path d="M12 10v6m0-9h.01"/></svg>;
  if (route === "technologies") return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8m-4-3v3"/></svg>;
  if (route === "projects" || route === "experience") return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="M4 5h16v15H4zM8 5V3h8v2M8 10h8m-8 4h5"/></svg>;
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
  const pathname = usePathname();
  const active = pathname === "/" ? "home" : pathname.split("/")[1];

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const toggleTheme = () => {
    setDark((current) => {
      document.body.classList.toggle("dark-portfolio", !current);
      return !current;
    });
  };

  return <header className={`dynamic-header ${open ? "is-expanded" : ""}`}>
    <div className="dynamic-collapsed">
      <button className="dynamic-logo-island" type="button" onClick={() => setOpen(true)} aria-label="Open navigation"><Image src="/images/logo.png" alt="Denta Bramasta" width={94} height={48} priority /></button>
      <button className="dynamic-route-island" type="button" onClick={() => setOpen(true)} aria-label={`Open navigation. Current section: ${active}`}><RouteIcon route={active} /></button>
    </div>
    <div className="dynamic-panel" aria-hidden={!open}>
      <button className="dynamic-close" type="button" onClick={() => setOpen(false)} aria-label="Close navigation"><span/><span/></button>
      <nav aria-label="Primary navigation">{navigation.map((item) => <Link className={active === item.section ? "is-active" : ""} key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
      <div className="dynamic-divider" />
      <div className="dynamic-controls">
        <a href={contact.socials[0].href} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
        <a href={contact.socials[1].href} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
        <button type="button" onClick={toggleTheme} aria-label={dark ? "Use light theme" : "Use dark theme"}>{dark ? "☀️" : "🌙"}</button>
      </div>
    </div>
  </header>;
}
