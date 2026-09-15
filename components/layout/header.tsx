"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, ChevronRight, ChevronUp, Code2, Contact, Download, FileText, FlaskConical, GitBranch, Home, Info, Mail, Moon, Orbit, PanelsTopLeft, Sun, X } from "lucide-react";
import { contact } from "@/statics/contact";
import { navigation } from "@/statics/navigation";

const navigationDescriptions: Record<string, string> = {
  home: "A quick introduction and selected work",
  about: "The story, education, and interests behind the work",
  projects: "A closer look at the things I have built",
  experience: "Roles, impact, and the journey so far",
  technologies: "Languages, frameworks, and everyday tools",
  blog: "Notes on engineering, products, and craft",
  docs: "A guide to the portfolio, experiments, and decisions",
  playground: "Small games and useful tools you can try",
  space: "An interactive journey around a black hole",
};

function RouteIcon({ route, className }: { route: string; className?: string }) {
  const icons = { home: Home, about: Info, projects: BriefcaseBusiness, experience: BriefcaseBusiness, technologies: Code2, blog: PanelsTopLeft, docs: FileText, playground: FlaskConical, space: Orbit, contact: Mail };
  const Icon = icons[route as keyof typeof icons] ?? Home;
  return <Icon className={className} aria-hidden="true" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const active = pathname === "/" ? "home" : pathname.split("/")[1];
  const activeLabel =
    navigation.find((item) => item.section === active)?.label ?? "Home";
  const primaryNavigation = navigation.filter((item) =>
    ["home", "about", "projects"].includes(item.section),
  );
  const featuredNavigation = navigation.filter((item) =>
    ["playground", "space"].includes(item.section),
  );
  const directoryNavigation = navigation.filter((item) =>
    ["experience", "technologies", "blog", "docs", "contact"].includes(item.section),
  );

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      )
        setOpen(false);
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

  return (
    <header
      ref={headerRef}
      className={`dynamic-header ${open ? "is-expanded" : ""} ${active === "space" ? "is-space-route" : ""}`}
    >
      <div className="apple-nav-bar">
        <Link
          className="apple-brand"
          href="/"
          aria-label="Denta Bramasta, home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={94}
            height={48}
            priority
          />
        </Link>
        <span className="apple-mobile-label">
          <RouteIcon route={active} />
          {activeLabel}
        </span>
        <nav className="apple-primary-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link
              className={active === item.section ? "is-active" : ""}
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="apple-nav-separator" aria-hidden="true" />
        <button
          className="apple-more-button"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="more-navigation"
        >
          More <ChevronUp aria-hidden="true" />
        </button>
      </div>

      <div className="apple-mega-menu" id="more-navigation" aria-hidden={!open}>
        <div className="apple-mega-heading">
          <div>
            <span>Explore more</span>
            <strong>The rest of my portfolio</strong>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close expanded navigation"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="apple-nav-directory">
          <section className="apple-directory-section apple-directory-featured">
            <span className="apple-directory-label">Featured</span>
            <div className="apple-featured-grid">
              {featuredNavigation.map((item) => (
                <Link
                  className={`apple-feature-card ${active === item.section ? "is-active" : ""}`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  <span className="apple-mega-icon">
                    <RouteIcon route={item.section} />
                  </span>
                  <span>
                    <strong>{item.label}</strong>
                    <small>{navigationDescriptions[item.section]}</small>
                  </span>
                  <b aria-hidden="true"><ChevronRight /></b>
                </Link>
              ))}
            </div>
          </section>

          <section className="apple-directory-section apple-directory-browse">
            <span className="apple-directory-label">Browse</span>
            <nav className="apple-directory-list" aria-label="Portfolio directory">
              {primaryNavigation.map((item) => (
                <Link
                  className={`apple-directory-link apple-directory-mobile-only ${active === item.section ? "is-active" : ""}`}
                  href={item.href}
                  key={`mobile-${item.href}`}
                  onClick={() => setOpen(false)}
                >
                  <RouteIcon route={item.section} />
                  <span>{item.label}</span>
                  <b aria-hidden="true"><ChevronRight /></b>
                </Link>
              ))}
              {directoryNavigation.map((item) => (
                <Link
                  className={`apple-directory-link ${active === item.section ? "is-active" : ""}`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  <RouteIcon route={item.section} />
                  <span>{item.label}</span>
                  <b aria-hidden="true"><ChevronRight /></b>
                </Link>
              ))}
            </nav>
          </section>
        </div>
        <div className="apple-quick-actions">
          <span>Quick actions</span>
          <a href={contact.socials[0].href} target="_blank" rel="noreferrer">
            <Contact aria-hidden="true" />
            LinkedIn
          </a>
          <a href={contact.socials[1].href} target="_blank" rel="noreferrer">
            <GitBranch aria-hidden="true" />
            GitHub
          </a>
          <button
            className="resume-disabled"
            type="button"
            disabled
            title="Résumé download is unavailable"
          >
            <span className="apple-file-icon"><Download aria-hidden="true" /></span>Résumé
          </button>
          <button type="button" onClick={toggleTheme}>
            <span>{dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</span>
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </header>
  );
}
